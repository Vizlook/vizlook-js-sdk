export enum HttpStatusCode {
  BadRequest = 400,
  Unauthorized = 401,
  TooManyRequests = 429,
  PayAsYouGoLimitExceeded = 432,
  InternalServerError = 500,
}

/**
 * Error class for Vizlook API errors
 */
export class VizlookError extends Error {
  statusCode: number;
  timestamp: string;
  path?: string;
  extra?: Record<string, any>;

  /**
   * @param {string} [message] - Error message
   * @param {number} [statusCode] - HTTP status code
   * @param {Object} [options] - Error options
   * @param {string} [options.timestamp] - ISO timestamp string
   * @param {string} [options.path] - Path that caused the error
   * @param {Record<string, any>} [options.extra] - Extra information
   */
  constructor(
    message: string,
    statusCode: number,
    options?: {
      timestamp?: string;
      path?: string;
      extra?: Record<string, any>;
    }
  ) {
    super(message);
    this.name = "VizlookError";
    this.statusCode = statusCode;
    this.timestamp = options?.timestamp ?? new Date().toISOString();
    this.path = options?.path;
    this.extra = options?.extra;
  }
}
