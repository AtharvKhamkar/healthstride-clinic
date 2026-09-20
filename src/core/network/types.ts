/**
 * Network layer type definitions
 */

/**
 * HTTP Methods supported by ApiClient
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Request configuration options
 */
export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | string[] | number[] | boolean[] | undefined>;
  timeout?: number;
  cancelToken?: string;
  onUploadProgress?: (progressEvent: { loaded: number; total: number }) => void;
  onDownloadProgress?: (progressEvent: { loaded: number; total: number }) => void;
}

/**
 * File upload configuration
 */
export interface UploadConfig {
  url: string;
  formData: FormData;
  onProgress?: (progress: number) => void;
  cancelToken?: string;
}

/**
 * Download configuration
 */
export interface DownloadConfig {
  url: string;
  onProgress?: (progress: number) => void;
  cancelToken?: string;
}

/**
 * ApiClient configuration
 */
export interface ApiClientConfig {
  baseURL: string;
  connectTimeout: number;
  receiveTimeout: number;
  sendTimeout: number;
}

/**
 * Storage interface for token management
 */
export interface TokenStorage {
  getAccessToken: () => Promise<string | null>;
  getRefreshToken: () => Promise<string | null>;
  setAccessToken: (token: string) => Promise<void>;
  setRefreshToken: (token: string) => Promise<void>;
  clearTokens: () => Promise<void>;
}

/**
 * Retry attempt information
 */
export interface RetryInfo {
  attempt: number;
  maxRetries: number;
  delayMs: number;
  method: string;
  url: string;
}