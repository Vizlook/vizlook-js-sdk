/**
 * Configure what search results include.
 * @typedef {Object} ContentOptions
 * @property {boolean} [needTranscription] - Whether to include video transcription in the search results.
 * @property {boolean} [needSummary] - Whether to include video summary in the search results.
 */
export interface ContentOptions {
  needTranscription?: boolean;
  needSummary?: boolean;
}

/**
 * Video category
 */
export type Category =
  | "Healthcare"
  | "Ecommerce"
  | "Tech"
  | "Finance"
  | "Education";

/**
 * Search options for performing a search query.
 * @typedef {Object} SearchOptions
 * @property {Category} [category] - A video category.
 * @property {string | number} [startPublishedDate] - Start date for results based on video published date in millisecond or ISO timestamp string.
 * @property {string | number} [endPublishedDate] - End date for results based on video published date in millisecond or ISO timestamp string.
 * @property {number} [maxResults] - The maximum number of search results to return. The default value is 10 and the maximum value is 20.
 * @property {ContentOptions} [config] - Configure what search results include.
 */
export interface SearchOptions {
  category?: Category;
  startPublishedDate?: string | number;
  endPublishedDate?: string | number;
  maxResults?: number;
  config?: ContentOptions;
}

/**
 * Video clip
 * @typedef {Object} VideoClip
 * @property {number} [startTime] - Start time of the video clip in seconds.
 * @property {number} [endTime] - End time of the video clip in seconds.
 * @property {string} [visualDescription] - Visual description of the video clip.
 */
export interface VideoClip {
  startTime: number;
  endTime: number;
  visualDescription: string;
}

/**
 * Audio clip
 * @typedef {Object} AudioClip
 * @property {number} [startTime] - Start time of the audio clip in seconds.
 * @property {number} [endTime] - End time of the audio clip in seconds.
 * @property {string} [transcription] - Transcription of the audio clip.
 * @property {string} [speakerId] - The speaker ID of the audio clip, such as 'speaker_1'. If the speaker is identified, it will be set to the speaker's name.
 */
export interface AudioClip {
  startTime: number;
  endTime: number;
  transcription: string;
  speakerId: string;
}

/**
 * Video transcription
 * @typedef {Object} VideoTranscription
 * @property {VideoClip[]} [videoClips] - Video clips with visual descriptions.
 * @property {AudioClip[]} [audioClips] - Audio clips with transcriptions.
 */
export interface VideoTranscription {
  videoClips: VideoClip[];
  audioClips: AudioClip[];
}

/**
 * The video clip that best matches the query.
 * @typedef {Object} VideoHighlight
 * @property {number} [startTime] - Start time of the video clip in seconds.
 * @property {number} [endTime] - End time of the video clip in seconds.
 * @property {string} [visualDescription] - Visual description of the video clip.
 * @property {string} [audioTranscription] - Audio transcription of the video clip.
 */
export interface VideoHighlight {
  startTime: number;
  endTime: number;
  visualDescription: string;
  audioTranscription?: string;
}

/**
 * Video summary
 * @typedef {Object} VideoSummary
 * @property {string} [overallSummary] - Overall summary of the video.
 * @property {Object[]} [sectionSummaries] - Section summaries of the video.
 * @property {number} [sectionSummaries.startTime] - Start time of the section in seconds.
 * @property {number} [sectionSummaries.endTime] - End time of the section in seconds.
 * @property {string} [sectionSummaries.title] - Title of the section.
 * @property {string} [sectionSummaries.summary] - Summary of the section.
 */
export interface VideoSummary {
  overallSummary: string;
  sectionSummaries: {
    startTime: number;
    endTime: number;
    title: string;
    summary: string;
  }[];
}

/**
 * @typedef {Object} SearchResultItem
 */
export interface SearchResultItem {
  /* Video page url */
  url: string;
  title: string;
  description: string;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
  author: {
    name: string;
    /* Author page url. */
    url?: string;
    avatar: string;
  };
  /* Video published date, ISO timestamp string */
  publishedDate: string;
  /* Video duration in seconds */
  duration: number;
  favicon: string;
  /* relevance score for query */
  score?: number;
  highlights: VideoHighlight[];
  transcription?: VideoTranscription;
  summary?: VideoSummary;
}

/**
 * Search response
 * @typedef {Object} SearchResponse
 * @property {SearchResultItem[]} results - Search results.
 * @property {Object} dollarCost - Dollar cost of the search.
 * @property {number} dollarCost.total - Total dollar cost.
 * @property {Object} dollarCost.breakdown - Dollar cost breakdown.
 * @property {number} dollarCost.breakdown.search - Search dollar cost.
 * @property {number} dollarCost.breakdown.summary - Summary dollar cost.
 * @property {number} dollarCost.breakdown.transcription - Transcription dollar cost.
 */
export interface SearchResponse {
  results: SearchResultItem[];
  dollarCost: {
    total: number;
    breakdown?: {
      search?: number;
      summary?: number;
      transcription?: number;
    };
  };
}

/**
 * @typedef {Object} AnswerOptions
 * @property {boolean} [needTranscription] - Whether to include video transcription in the answer citations.
 */
export interface AnswerOptions {
  needTranscription?: boolean;
}

/**
 * @typedef {Object} AnswerCitationItem
 */
export interface AnswerCitationItem {
  /* Video page url */
  url: string;
  title: string;
  description: string;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
  author: {
    name: string;
    /* Author page url. */
    url?: string;
    avatar: string;
  };
  /* Video published date, ISO timestamp string */
  publishedDate: string;
  /* Video duration in seconds */
  duration: number;
  favicon: string;
  /* relevance score for query */
  score?: number;
  highlights: VideoHighlight[];
  transcription?: VideoTranscription;
}

/**
 * @typedef {Object} AnswerResponse
 * @property {string} answer - Answer to the query.
 * @property {AnswerCitationItem[]} citations - Answer citations.
 * @property {Object} dollarCost - Dollar cost of the answer.
 * @property {number} dollarCost.total - Total dollar cost.
 */
export interface AnswerResponse {
  answer: string;
  citations: AnswerCitationItem[];
  dollarCost: {
    total: number;
  };
}

/**
 * @typedef {Object} AnswerStreamChunk
 * @property {string} type - Type of the stream chunk.
 * @property {string} data - Data of the stream chunk.
 */
export type AnswerStreamChunk =
  | { type: "answer-chunk"; data: string }
  | {
      type: "citations";
      data: { citations: AnswerCitationItem[] };
    }
  | {
      type: "cost";
      data: { dollarCost: { total: number } };
    }
  | { type: "error"; data: { errorText: string } };

/**
 * @typedef {Object} VideoContentsOptions
 * @property {string} [crawlMode] - Crawl mode, default is 'Never'
 * @property {ContentOptions} [config] - Configure what video results include.
 */
export interface VideoContentsOptions {
  crawlMode?: "Never" | "Fallback" | "Always";
  config?: ContentOptions;
}

/**
 * @typedef {string} VideoContentErrorType - Error type when getting video contents
 */
export type VideoContentErrorType =
  | "FAILED_TO_PARSE_URL"
  | "CACHE_NOT_FOUND"
  | "CRAWL_SOURCE_FAIL"
  | "CRAWL_NOT_FOUND"
  | "CRAWL_VIDEO_DURATION_EXCEEDS_LIMIT"
  | "CRAWL_SERVER_ERROR"
  | "CRAWL_TIMEOUT";

/**
 * @typedef {Object} VideoContent
 * @property {Object} data - Video content data.
 * @property {string} data.url - Video page url.
 * @property {string} data.title - Video title.
 * @property {string} data.description - Video description.
 * @property {Object} data.thumbnail - Video thumbnail.
 * @property {string} data.thumbnail.url - Thumbnail URL.
 * @property {number} data.thumbnail.width - Thumbnail width.
 * @property {number} data.thumbnail.height - Thumbnail height.
 * @property {Object} data.author - Video author.
 * @property {string} data.author.name - Author name.
 * @property {string} data.author.url - Author page url.
 * @property {string} data.author.avatar - Author avatar.
 * @property {string} data.publishedDate - Video published date, ISO timestamp string.
 * @property {number} data.duration - Video duration in seconds.
 * @property {string} data.favicon - Video page favicon.
 * @property {VideoTranscription} data.transcription - Video transcription.
 * @property {VideoSummary} data.summary - Video summary.
 * @property {Object} status - Video content status.
 * @property {string} status.url - Video page url.
 * @property {string} status.status - Video content status.
 * @property {Object} status.error - Video content error if has error.
 * @property {VideoContentErrorType} status.error.type - Error type.
 * @property {string} status.error.message - Error message if has message.
 * @property {boolean} status.isLiveCrawl - Whether the video content is crawled live.
 */
export interface VideoContent {
  data?: {
    url: string;
    title: string;
    description: string;
    thumbnail: {
      url: string;
      width: number;
      height: number;
    };
    author: {
      name: string;
      url?: string;
      avatar: string;
    };
    publishedDate: string;
    duration: number;
    favicon: string;
    transcription?: VideoTranscription;
    summary?: VideoSummary;
  };
  status: {
    url: string;
    status: "Success" | "Fail";
    error?: {
      type: VideoContentErrorType;
      message?: string;
    };
    isLiveCrawl?: boolean;
  };
}

/**
 * @typedef {Object} VideoContentsResponse
 * @property {VideoContent[]} results - Video contents.
 * @property {Object} dollarCost - Dollar cost of the video contents.
 * @property {number} dollarCost.total - Total dollar cost.
 * @property {Object} dollarCost.breakdown - Dollar cost breakdown.
 * @property {number} dollarCost.breakdown.transcription - Transcription dollar cost.
 * @property {number} dollarCost.breakdown.summary - Summary dollar cost.
 * @property {number} dollarCost.breakdown.crawl - Live crawl dollar cost.
 */
export interface VideoContentsResponse {
  results: VideoContent[];
  dollarCost: {
    total: number;
    breakdown?: {
      transcription?: number;
      summary?: number;
      crawl?: number;
    };
  };
}
