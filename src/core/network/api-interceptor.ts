import type { AxiosInstance, AxiosResponse } from 'axios';
import { ApiException, UnauthorizedException, TimeoutException, NetworkException, RequestCancelledException, ForbiddenException, NotFoundException, ValidationException, TooManyRequestsException, ServerException } from './api-exception';

/**
 * Configuration for AuthInterceptor
 */
export interface AuthInterceptorConfig {
  /** Callback to get access token */
  getAccessToken: () => Promise<string | null>;
  /** Callback to get refresh token */
  getRefreshToken: () => Promise<string | null>;
  /** Callback to set new access token */
  setAccessToken: (token: string) => Promise<void>;
  /** Callback to set new refresh token */
  setRefreshToken: (token: string) => Promise<void>;
  /** Callback to clear tokens */
  clearTokens: () => Promise<void>;
  /** Callback when session expires */
  onSessionExpired?: () => void;
  /** Public endpoints that don't require authentication */
  publicEndpoints?: string[];
}

/**
 * Configuration for RetryInterceptor
 */
export interface RetryInterceptorConfig {
  /** Maximum number of retries */
  maxRetries?: number;
  /** Retryable HTTP methods */
  retryableMethods?: string[];
  /** Retryable HTTP status codes */
  retryableStatuses?: number[];
  /** Base delay for exponential backoff (ms) */
  baseDelayMs?: number;
}

/**
 * Configuration for LoggingInterceptor
 */
export interface LoggingInterceptorConfig {
  /** Enable/disable logging */
  enabled?: boolean;
  /** Custom logger function */
  logger?: (message: string, ...args: unknown[]) => void;
}

/**
 * AuthInterceptor
 * Handles JWT token attachment and automatic refresh
 */
export class AuthInterceptor {
  private refreshPromise: Promise<string> | null = null;
  private readonly config: AuthInterceptorConfig;

  constructor(config: AuthInterceptorConfig) {
    this.config = {
      publicEndpoints: ['/auth/login', '/auth/register', '/auth/refresh-token', '/auth/verify-otp'],
      ...config,
    };
  }

  /**
   * Request interceptor - attach auth token
   */
  onRequest = async (config: unknown): Promise<unknown> => {
    const configAny = config as Record<string, unknown>;
    const requestPath = (configAny.url as string | undefined)?.split('?')[0] || '';

    // Skip auth for public endpoints
    const isPublic = this.config.publicEndpoints?.some(
      (endpoint) => requestPath === endpoint || requestPath.endsWith(endpoint)
    );

    if (!isPublic) {
      const token = await this.config.getAccessToken();
      if (token) {
        configAny.headers = {
          ...(configAny.headers as Record<string, string> | undefined),
          Authorization: `Bearer ${token}`,
        };
      }
    }

    // Set default headers
    configAny.headers = {
      ...(configAny.headers as Record<string, string> | undefined),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    return configAny;
  };

  /**
   * Response interceptor - handle token refresh
   */
  onResponse = (response: AxiosResponse): AxiosResponse => {
    return response;
  };

  /**
   * Error interceptor - handle 401 errors and refresh token
   */
  onError = async (error: unknown, axiosInstance: AxiosInstance): Promise<unknown> => {
    const axiosError = error as {
      response?: AxiosResponse;
      requestOptions?: Record<string, unknown>;
      message?: string;
    };

    // Only handle 401 errors
    if (axiosError.response?.status !== 401) {
      throw error;
    }

    // If refresh is already in progress, wait for it
    if (this.refreshPromise) {
      try {
        const newToken = await this.refreshPromise;
        return this.retryRequest(axiosError, newToken, axiosInstance);
      } catch {
        throw error;
      }
    }

    // Start token refresh
    this.refreshPromise = this.refreshToken(axiosInstance);

    try {
      const newToken = await this.refreshPromise;
      return this.retryRequest(axiosError, newToken, axiosInstance);
    } catch {
      // Refresh failed - clear tokens and redirect
      await this.config.clearTokens();
      this.config.onSessionExpired?.();
      throw error;
    } finally {
      this.refreshPromise = null;
    }
  };

  /**
   * Refresh access token using refresh token
   */
  private async refreshToken(axiosInstance: AxiosInstance): Promise<string> {
    const refreshToken = await this.config.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axiosInstance.post<{
        success: boolean;
        data: { accessToken: string; refreshToken: string };
      }>('/auth/refresh-token', { refreshToken });

      const { accessToken, refreshToken: newRefreshToken } = response.data.data;

      await this.config.setAccessToken(accessToken);
      await this.config.setRefreshToken(newRefreshToken);

      return accessToken;
    } catch (error) {
      throw new UnauthorizedException('Token refresh failed');
    }
  }

  /**
   * Retry original request with new token
   */
  private async retryRequest(
    axiosError: { requestOptions?: Record<string, unknown> },
    newToken: string,
    axiosInstance: AxiosInstance,
  ): Promise<AxiosResponse> {
    if (!axiosError.requestOptions) {
      throw new Error('No request options available for retry');
    }

    const requestConfig = { ...axiosError.requestOptions };
    requestConfig.headers = {
      ...(requestConfig.headers as Record<string, string> | undefined),
      Authorization: `Bearer ${newToken}`,
    };

    return axiosInstance.request(requestConfig);
  }
}

/**
 * RetryInterceptor
 * Retries failed requests with exponential backoff
 */
export class RetryInterceptor {
  private readonly config: RetryInterceptorConfig;

  constructor(config: RetryInterceptorConfig = {}) {
    this.config = {
      maxRetries: 3,
      retryableMethods: ['GET', 'PUT', 'DELETE'],
      retryableStatuses: [502, 503, 504],
      baseDelayMs: 1000,
      ...config,
    };
  }

  /**
   * Response interceptor - check if retry is needed
   */
  onResponse = (response: AxiosResponse): AxiosResponse => {
    return response;
  };

  /**
   * Error interceptor - retry on transient failures
   */
  onError = async (
    error: unknown,
    axiosInstance: AxiosInstance
  ): Promise<unknown> => {
    const axiosError = error as {
      requestOptions?: Record<string, unknown>;
      response?: AxiosResponse;
      message?: string;
    };

    if (!axiosError.requestOptions) {
      throw error;
    }

    const method = (axiosError.requestOptions.method as string | undefined)?.toUpperCase();

    // Only retry idempotent methods
    if (!this.config.retryableMethods?.includes(method || '')) {
      throw error;
    }

    const statusCode = axiosError.response?.status;
    const isRetryable =
      this.isTransientError(axiosError) ||
      (statusCode !== undefined && this.config.retryableStatuses?.includes(statusCode));

    if (!isRetryable) {
      throw error;
    }

    const headers = axiosError.requestOptions?.headers as Record<string, string> | undefined;
    const retryAttempt = headers?.['X-Retry-Attempt'];
    const attempt = (retryAttempt ? parseInt(retryAttempt, 10) : 0) as number;

    if (attempt >= (this.config.maxRetries ?? 3)) {
      throw error;
    }

    // Exponential backoff: 1s, 2s, 4s
    const delayMs = (this.config.baseDelayMs ?? 1000) * Math.pow(2, attempt);

    // Wait before retrying
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    // Retry the request
    const retryConfig = {
      ...axiosError.requestOptions,
      headers: {
        ...(axiosError.requestOptions.headers as Record<string, string> | undefined),
        'X-Retry-Attempt': attempt + 1,
      },
    };

    return axiosInstance.request(retryConfig as Record<string, unknown>);
  };

  /**
   * Check if error is a transient network error
   */
  private isTransientError(error: { message?: string }): boolean {
    const transientMessages = [
      'ECONNRESET',
      'ETIMEDOUT',
      'ENOTFOUND',
      'EAI_AGAIN',
      'Network request failed',
    ];

    return transientMessages.some((msg) =>
      error.message?.includes(msg)
    );
  }
}

/**
 * LoggingInterceptor
 * Logs all requests and responses for debugging
 */
export class LoggingInterceptor {
  private readonly config: {
    enabled: boolean;
    logger: (message: string, ...args: unknown[]) => void;
  };

  constructor(config: LoggingInterceptorConfig = {}) {
    this.config = {
      enabled: Boolean(config.enabled),
      logger: config.logger ?? ((msg: string, ...args: unknown[]) => console.log(msg, ...args)),
    };
  }

  /**
   * Log request
   */
  onRequest = async (config: unknown): Promise<unknown> => {
    const configAny = config as Record<string, unknown>;
    
    if (this.config.enabled !== false) {
      this.log(`[REQUEST] ${(configAny.method as string | undefined)?.toUpperCase()} ${configAny.url as string | undefined}`);

      if (configAny.params) {
        this.log(`[REQUEST] Params:`, JSON.stringify(configAny.params, null, 2));
      }

      if (configAny.data) {
        this.log(`[REQUEST] Body:`, JSON.stringify(configAny.data, null, 2));
      }
    }

    return configAny;
  };

  /**
   * Log response
   */
  onResponse = (response: AxiosResponse): AxiosResponse => {
    if (this.config.enabled !== false) {
      this.log(
        `[RESPONSE] ${response.status} ${response.request.method?.toUpperCase()} ${response.config.url}`
      );
    }

    return response;
  };

  /**
   * Log error
   */
  onError = (error: unknown): unknown => {
    if (this.config.enabled) {
      const axiosError = error as {
        response?: AxiosResponse;
        message?: string;
        requestOptions?: Record<string, unknown>;
      };

      const method = (axiosError.requestOptions?.method as string | undefined)?.toUpperCase();
      const url = axiosError.requestOptions?.url as string | undefined;

      this.log(
        `[ERROR] ${axiosError.response?.status ?? 'NETWORK'} ${method ?? 'UNKNOWN'} ${url ?? 'unknown'}`
      );
      this.log(`[ERROR] Message: ${axiosError.message}`);
    }

    throw error;
  };

  /**
   * Log message using configured logger
   */
  private log(message: string, ...args: unknown[]): void {
    try {
      this.config.logger?.(message, ...args);
    } catch {
      // Ignore logging errors
    }
  }
}

/**
 * NetworkErrorClassifier
 * Classifies Axios errors into application-level exceptions
 */
export class NetworkErrorClassifier {
  /**
   * Classify error and return appropriate ApiException
   */
  static classify(error: unknown): ApiException {
    const axiosError = error as {
      response?: AxiosResponse<{ error?: { code?: string; message?: string }; message?: string }>;
      code?: string;
      message?: string;
      requestOptions?: { method?: string; url?: string; baseURL?: string };
    };

    // Log error details for debugging
    this.logError(error);

    // Timeout errors
    if (this.isTimeoutError(axiosError)) {
      return new TimeoutException('Request timed out. Please try again.');
    }

    // Network errors
    if (this.isNetworkError(axiosError)) {
      return new NetworkException(
        'No internet connection. Please check your network.'
      );
    }

    // Request cancelled
    if (axiosError.code === 'ERR_CANCELED' || axiosError.message?.includes('canceled')) {
      return new RequestCancelledException('Request was cancelled.');
    }

    // HTTP errors
    if (axiosError.response) {
      return this.classifyHttpError(axiosError);
    }

    // Unknown errors
    return new ApiException(
      error instanceof Error ? error.message : 'An unexpected error occurred.',
      Number(axiosError.code)
    );
  }

  /**
   * Classify HTTP error based on status code
   */
  private static classifyHttpError(
    axiosError: { response?: AxiosResponse<{ error?: { code?: string; message?: string }; message?: string }> }
  ): ApiException {
    const response = axiosError.response;
    const statusCode = response?.status as number | undefined;
    const data = response?.data;
    
    let message: string;
    let errorCode: string | undefined;
    let errorData: unknown;

    if (data) {
      const dataAny = data as { error?: { code?: string; message?: string; data?: unknown }; message?: string };
      const status = statusCode as number | undefined;
      message = dataAny.error?.message || dataAny.message || this.getDefaultMessage(status);
      errorCode = dataAny.error?.code;
      errorData = dataAny.error?.data;
    } else {
      message = this.getDefaultMessage(statusCode);
    }

    switch (statusCode) {
      case 401:
        return new UnauthorizedException(message, statusCode as number, errorCode);
      case 403:
        return new ForbiddenException(message, statusCode as number, errorCode, errorData);
      case 404:
        return new NotFoundException(message, statusCode as number);
      case 422:
        const validationData = data as { error?: { data?: Record<string, string[]> }; errors?: Record<string, string[]> } | undefined;
        const validationErrors = this.extractValidationErrors(validationData);
        return new ValidationException(message, statusCode as number, validationErrors);
      case 429:
        return new TooManyRequestsException(message, statusCode as number);
      case 500:
      case 502:
      case 503:
      case 504:
        return new ServerException(
          'Something went wrong. Please try again later.',
          statusCode as number
        );
      default:
        return new ApiException(message, statusCode as number, errorCode, errorData);
    }
  }

  /**
   * Extract validation errors from response
   */
  private static extractValidationErrors(
    data?: { error?: { data?: Record<string, string[]> }; errors?: Record<string, string[]> }
  ): Map<string, string[]> | undefined {
    if (!data) {
      return undefined;
    }

    const errors = data.error?.data || data.errors;
    if (!errors) {
      return undefined;
    }

    return new Map(Object.entries(errors));
  }

  /**
   * Check if error is a timeout
   */
  private static isTimeoutError(error: { code?: string; message?: string }): boolean {
    return (
      error.code === 'ECONNABORTED' ||
      error.message?.includes('timeout') ||
      error.message?.includes('ETIMEDOUT') 
    ) ?? false; 
  }

  /**
   * Check if error is a network error
   */
  private static isNetworkError(error: { code?: string; message?: string }): boolean {
    return (
      error.code === 'ERR_NETWORK' ||
      error.message?.includes('Network request failed') ||
      error.message?.includes('ECONNRESET') ||
      error.message?.includes('ENOTFOUND')
    ) ?? false;
  }

  /**
   * Get default error message for status code
   */
  private static getDefaultMessage(statusCode: number | undefined): string {
    switch (statusCode) {
      case 400:
        return 'Bad request. Please check your input.';
      case 401:
        return 'Session expired. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'Resource already exists.';
      case 422:
        return 'Validation failed. Please check your input.';
      case 429:
        return 'Too many requests. Please wait a moment.';
      case 500:
      case 502:
      case 503:
      case 504:
        return 'Server error. Please try again later.';
      default:
        return 'An unexpected error occurred.';
    }
  }

  /**
   * Log error details for debugging (placeholder for future logging implementation)
   */
  private static logError(error: unknown): void {
    // This is a placeholder for logging
    // Actual logging will be implemented when logging service is integrated
    const axiosError = error as Record<string, unknown>;
    
    const response = axiosError.response as Record<string, unknown> | undefined;
    const requestOptions = axiosError.requestOptions as Record<string, unknown> | undefined;
    const message = axiosError.message as string | undefined;

    // Log format matches Flutter's error logging format
    // ERROR :: ClassName.methodName :: error.toString() :: stack
    console.error('ERROR :: NetworkErrorClassifier.classify ::', {
      statusCode: response?.status,
      message: message,
      url: requestOptions?.baseURL && requestOptions?.url
        ? `${requestOptions.baseURL}${requestOptions.url}`
        : requestOptions?.url,
      data: response?.data,
    });
  }
}