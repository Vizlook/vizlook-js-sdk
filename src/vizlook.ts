import { HttpStatusCode, VizlookError } from "./errors";
import {
  AnswerOptions,
  AnswerResponse,
  AnswerStreamChunk,
  SearchOptions,
  SearchResponse,
  VideoContentsOptions,
  VideoContentsResponse,
} from "./types";

export interface VizlookOptions {
  apiKey?: string;
  baseURL?: string;
}

/**
 * The Vizlook class encapsulates the API's endpoints.
 */
export class Vizlook {
  private baseURL: string;
  private headers: Headers;

  /**
   * Constructs the Vizlook SDK client.
   * @param {VizlookOptions} [VizlookOptions] - The options for the Vizlook SDK client.
   * @param {string} [VizlookOptions.apiKey] - The API key for authentication.
   * @param {string} [VizlookOptions.baseURL] - The base URL of the Vizlook API.
   */
  constructor({ apiKey, baseURL }: VizlookOptions = {}) {
    if (!apiKey) {
      apiKey = process.env.VIZLOOK_API_KEY;
      if (!apiKey) {
        throw new VizlookError(
          "The API key must be provided as an argument or as an environment variable (VIZLOOK_API_KEY).",
          HttpStatusCode.Unauthorized
        );
      }
    }

    this.baseURL = baseURL || "https://api.vizlook.com";
    this.headers = new Headers({
      "x-api-key": apiKey,
      "Content-Type": "application/json",
      "User-Agent": "vizlook-js-sdk 1.0.0",
    });
  }

  /**
   * Makes a request to the Vizlook API.
   * @param {string} endpoint - The API endpoint to call.
   * @param {string} method - The HTTP method to use.
   * @param {any} [body] - The request body for POST requests.
   * @param {Record<string, any>} [params] - The query parameters.
   * @returns {Promise<T>} The response from the API.
   * @throws {VizlookError} When any API request fails with structured error information.
   */
  async request<T = unknown>(
    endpoint: string,
    method: string,
    body?: any,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ): Promise<T> {
    let url = this.baseURL + endpoint;

    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value)) {
          for (const item of value) {
            searchParams.append(key, item);
          }
        } else if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      }
      url += `?${searchParams.toString()}`;
    }

    let combinedHeaders: Record<string, string> = {};

    this.headers.forEach((value, key) => {
      combinedHeaders[key] = value;
    });

    if (headers) {
      combinedHeaders = { ...combinedHeaders, ...headers };
    }

    try {
      const response = await fetch(url, {
        method,
        headers: combinedHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const { error = "Unknown error.", ...extra } = errorData;

        throw new VizlookError(error, response.status, {
          path: endpoint,
          extra,
        });
      }

      return (await response.json()) as T;
    } catch (err) {
      if (err instanceof VizlookError) {
        throw err;
      }

      throw new VizlookError(
        `An unknown error occurred while making the request.\n${(err as Error).message || String(err)}`,
        HttpStatusCode.InternalServerError,
        {
          path: endpoint,
        }
      );
    }
  }

  /**
   * Performs a search with a query.
   *
   * @param {string} query - The query string. The query is limited to 500 characters.
   * @param {SearchOptions} [options] - Additional search options
   * @returns {Promise<SearchResponse>} A list of relevant search results.
   */
  async search(
    query: string,
    options?: SearchOptions
  ): Promise<SearchResponse> {
    const { includeTranscription, includeSummary, ...restOptions } =
      options || {};

    return await this.request<SearchResponse>("/search", "POST", {
      query,
      contentOptions: {
        includeTranscription,
        includeSummary,
      },
      ...restOptions,
    });
  }

  /**
   * Answers a query in non-stream mode.
   *
   * @param {string} query - The query string. The query is limited to 500 characters.
   * @param {AnswerOptions} [options] - Additional answer options
   * @returns {Promise<AnswerResponse>} The answer to the query.
   */
  async answer(
    query: string,
    options?: AnswerOptions
  ): Promise<AnswerResponse> {
    const body = {
      query,
      stream: false,
      contentOptions: {
        includeTranscription: options?.includeTranscription,
      },
    };

    return await this.request<AnswerResponse>("/answer", "POST", body);
  }

  /**
   * Answers a query in stream mode.
   *
   * @param {string} query - The query string. The query is limited to 500 characters.
   * @param {AnswerOptions} [options] - Additional answer options
   * @returns {Promise<AnswerStreamChunk>} The stream of answer chunks.
   *
   * Example:
   * ```ts
   * for await (const chunk of vizlook.streamAnswer("How to learn python?", {
   *   needTranscription: true,
   * })) {
   *   console.log(chunk);
   * }
   * ```
   */
  async *streamAnswer(
    query: string,
    options?: AnswerOptions
  ): AsyncGenerator<AnswerStreamChunk> {
    const body = {
      query,
      stream: true,
      contentOptions: {
        includeTranscription: options?.includeTranscription,
      },
    };

    const response = await fetch(this.baseURL + "/answer", {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const { error = "Unknown error.", ...extra } = errorData;

      throw new VizlookError(error, response.status, {
        path: "/answer",
        extra,
      });
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new VizlookError(
        "No response body available for streaming.",
        HttpStatusCode.InternalServerError,
        {
          path: "/answer",
        }
      );
    }

    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) {
            continue;
          }

          const jsonStr = line.replace(/^data:\s*/, "").trim();
          if (!jsonStr || jsonStr === "[DONE]") {
            continue;
          }

          let chunkData: any;
          try {
            chunkData = JSON.parse(jsonStr) as AnswerStreamChunk;
            yield chunkData;
          } catch (err) {
            continue;
          }
        }
      }

      if (buffer.startsWith("data: ")) {
        const leftover = buffer.replace(/^data:\s*/, "").trim();
        if (leftover && leftover !== "[DONE]") {
          try {
            const chunkData = JSON.parse(leftover) as AnswerStreamChunk;
            yield chunkData;
          } catch (e) {
            // ignore
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Retrieves contents of videos based on URLs.
   *
   * @param {string | string[]} urls - A URL or array of URLs. Only support YouTube URLs for now, such as https://www.youtube.com/watch?v=xxxxxx
   * @param {VideoContentsOptions} [options] - Additional options for retrieving video contents.
   * @returns {Promise<VideoContentsResponse>} A list of video contents for the requested URLs.
   */
  async getVideoContents(
    urls: string | string[],
    options?: VideoContentsOptions
  ): Promise<VideoContentsResponse> {
    if (!Array.isArray(urls)) {
      urls = [urls];
    }

    const { includeTranscription, includeSummary, ...restOptions } =
      options || {};

    return await this.request<VideoContentsResponse>("/videos", "POST", {
      urls,
      contentOptions: {
        // The result will include at least one of the transcription and summary; by default, the transcription will be returned.
        includeTranscription: includeTranscription || !includeSummary,
        includeSummary,
      },
      ...restOptions,
    });
  }
}
