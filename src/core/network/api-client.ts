import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelToken } from 'axios';
import { AuthInterceptor, RetryInterceptor, LoggingInterceptor } from './api-interceptor';
import { NetworkErrorClassifier } from './api-interceptor';
import type { ApiException } from './api-exception';
import type { ApiResponse } from './api-response';
import { EnvironmentConfig } from '../config/environment';

/**
 * ApiClient - Axios wrapper with interceptors and error handling
 * This is the ONLY class that knows about Axios
 * All other layers use this client
 */
export class ApiClient {
  private readonly client: AxiosInstance;
  private readonly authInterceptor: AuthInterceptor;
  private readonly retryInterceptor: RetryInterceptor;
  private readonly loggingInterceptor: LoggingInterceptor;

  constructor(
    environmentConfig: EnvironmentConfig,
    storage: {
      getAccessToken: () => Promise<string | null>;
      getRefreshToken: () => Promise<string | null>;
      setAccessToken: (token: string) => Promise<void>;
      setRefreshToken: (token: string) => Promise<void>;
      clearTokens: () => Promise<void>;
    },
    onSessionExpired?: () => void,
  ) {
    // Create Axios instance
    this.client = axios.create({
      baseURL: environmentConfig.baseUrl,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Create interceptors
    this.authInterceptor = new AuthInterceptor({
      getAccessToken: storage.getAccessToken,
      getRefreshToken: storage.getRefreshToken,
      setAccessToken: storage.setAccessToken,
      setRefreshToken: storage.setRefreshToken,
      clearTokens: storage.clearTokens,
      onSessionExpired: onSessionExpired,
    });

    this.retryInterceptor = new RetryInterceptor();
    this.loggingInterceptor = new LoggingInterceptor();

    // Register interceptors
    this.registerInterceptors();
  }

  /**
   * Register all interceptors
   */
  private registerInterceptors(): void {
    // Request interceptors
    this.client.interceptors.request.use(
      (config) => this.authInterceptor.onRequest(config),
      (error: unknown) => Promise.reject(error)
    );

    this.client.interceptors.request.use(
      (config) => this.loggingInterceptor.onRequest(config),
      (error: unknown) => Promise.reject(error)
    );

    // Response interceptors
    this.client.interceptors.response.use(
      (response) => this.loggingInterceptor.onResponse(response),
      (error: unknown) => this.loggingInterceptor.onError(error)
    );

    this.client.interceptors.response.use(
      (response) => this.authInterceptor.onResponse(response),
      (error: unknown) => this.authInterceptor.onError(error, this.client).catch(() => {
        throw error;
      })
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error: unknown) => this.retryInterceptor.onError(error, this.client).catch(() => {
        throw error;
      })
    );
  }

  /**
   * Generic GET request
   */
  async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generic POST request
   */
  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generic PUT request
   */
  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generic PATCH request
   */
  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generic DELETE request
   */
  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload file (multipart/form-data)
   */
  async uploadFile<T = unknown>(
    url: string,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    try {
      const response = await this.client.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: ProgressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Download file
   */
  async downloadFile(
    url: string,
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    try {
      const response = await this.client.get(url, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent: ProgressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create cancel token for request cancellation
   */
  createCancelToken(): CancelToken {
    return axios.CancelToken.source().token;
  }

  /**
   * Handle error and convert to ApiException
   */
  private handleError(error: unknown): ApiException {
    // Error classification is handled by NetworkErrorClassifier
    return NetworkErrorClassifier.classify(error);
  }

  /**
   * Get raw Axios instance (for advanced use cases only)
   * Use with caution - prefer using ApiClient methods
   */
  getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}