/**
 * Network layer barrel export
 * Import from here for cleaner imports
 */

// Main client
export { ApiClient, type EnvironmentConfig } from './api-client';

// Response types
export type { ApiResponse } from './api-response';
export type { PaginationMeta, PaginatedResponse, ApiResponseParser } from './api-response';

// Exceptions
export type {
  ApiException,
  NetworkException,
  ServerException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ValidationException,
  TimeoutException,
  RequestCancelledException,
  TooManyRequestsException,
} from './api-exception';

// Interceptors
export type {
  AuthInterceptor,
  AuthInterceptorConfig,
  RetryInterceptor,
  RetryInterceptorConfig,
  LoggingInterceptor,
  LoggingInterceptorConfig,
  NetworkErrorClassifier,
} from './api-interceptor';

// Types
export type { HttpMethod, RequestConfig, UploadConfig, DownloadConfig, TokenStorage, RetryInfo, ApiClientConfig } from './types';
