/**
 * Base API Exception class
 * All API-related errors should extend this class
 */
export class ApiException extends Error {
  constructor(
    public message: string,
    public statusCode?: number,
    public errorCode?: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiException';
  }

  toString() {
    return `${this.name}: ${this.message} (statusCode: ${this.statusCode}, errorCode: ${this.errorCode})`;
  }
}

/**
 * Network connection error
 */
export class NetworkException extends ApiException {
  constructor(
    message = 'No internet connection. Please check your network.',
    statusCode?: number,
  ) {
    super(message, statusCode);
    this.name = 'NetworkException';
  }
}

/**
 * Server error (500+)
 */
export class ServerException extends ApiException {
  constructor(
    message = 'Server error. Please try again later.',
    statusCode = 500,
  ) {
    super(message, statusCode);
    this.name = 'ServerException';
  }
}

/**
 * Unauthorized error (401)
 */
export class UnauthorizedException extends ApiException {
  constructor(
    message = 'Session expired. Please log in again.',
    statusCode = 401,
    errorCode?: string,
  ) {
    super(message, statusCode, errorCode);
    this.name = 'UnauthorizedException';
  }
}

/**
 * Forbidden error (403)
 */
export class ForbiddenException extends ApiException {
  constructor(
    message = 'You do not have permission to perform this action.',
    statusCode = 403,
    errorCode?: string,
    data?: unknown,
  ) {
    super(message, statusCode, errorCode, data);
    this.name = 'ForbiddenException';
  }
}

/**
 * Not found error (404)
 */
export class NotFoundException extends ApiException {
  constructor(
    message = 'The requested resource was not found.',
    statusCode = 404,
  ) {
    super(message, statusCode);
    this.name = 'NotFoundException';
  }
}

/**
 * Validation error (422)
 */
export class ValidationException extends ApiException {
  constructor(
    message = 'Validation failed. Please check your input.',
    statusCode = 422,
    public errors?: Map<string, string[]>,
  ) {
    super(message, statusCode);
    this.name = 'ValidationException';
  }
}

/**
 * Timeout error
 */
export class TimeoutException extends ApiException {
  constructor(
    message = 'Request timed out. Please try again.',
    statusCode?: number,
  ) {
    super(message, statusCode);
    this.name = 'TimeoutException';
  }
}

/**
 * Request cancelled error
 */
export class RequestCancelledException extends ApiException {
  constructor(
    message = 'Request was cancelled.',
    statusCode?: number,
  ) {
    super(message, statusCode);
    this.name = 'RequestCancelledException';
  }
}

/**
 * Too many requests error (429)
 */
export class TooManyRequestsException extends ApiException {
  constructor(
    message = 'Too many requests. Please wait a moment.',
    statusCode = 429,
  ) {
    super(message, statusCode);
    this.name = 'TooManyRequestsException';
  }
}