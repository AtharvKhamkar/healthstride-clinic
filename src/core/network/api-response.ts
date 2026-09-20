/**
 * Generic API Response wrapper
 * Standardizes all API responses across the application
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
  errors?: Record<string, string[]>;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  message?: string;
}

/**
 * Helper class to parse API responses
 */
export class ApiResponseParser {
  /**
   * Check if response has data
   */
  static hasData<T>(response: ApiResponse<T>): boolean {
    return response.data !== undefined && response.data !== null;
  }

  /**
   * Check if response has errors
   */
  static hasErrors(response: ApiResponse): boolean {
    return response.errors !== undefined && response.errors !== null && Object.keys(response.errors).length > 0;
  }

  /**
   * Check if response has pagination metadata
   */
  static hasPagination(response: ApiResponse): boolean {
    return !!response.meta;
  }

  /**
   * Extract pagination info from response
   */
  static getPagination(response: ApiResponse): PaginationMeta | null {
    if (!this.hasPagination(response) || !response.meta) {
      return null;
    }

    const currentPage = response.meta['currentPage'] as number | undefined;
    const totalPages = response.meta['totalPages'] as number | undefined;
    const totalItems = response.meta['totalItems'] as number | undefined;

    if (currentPage === undefined || totalPages === undefined) {
      return null;
    }

    return {
      currentPage,
      totalPages,
      totalItems: totalItems ?? 0,
      hasNextPage: currentPage < totalPages,
    };
  }

  /**
   * Parse paginated response into typed PaginatedResponse
   */
  static parsePaginatedResponse<T>(
    json: unknown,
    fromJson: (item: unknown) => T,
  ): PaginatedResponse<T> {
    const response = json as ApiResponse<unknown[]>;
    const data = Array.isArray(response.data) ? response.data : [];
    const pagination = this.getPagination(response);

    return {
      success: response.success ?? false,
      data: data.map(fromJson),
      pagination: pagination ?? {
        currentPage: 1,
        totalPages: 1,
        totalItems: data.length,
        hasNextPage: false,
      },
      message: response.message,
    };
  }
}
