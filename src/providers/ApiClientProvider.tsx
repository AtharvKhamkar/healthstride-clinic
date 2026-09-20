'use client';

import { createContext, useContext, ReactNode } from 'react';
import { ApiClient } from '../core/network/api-client';
import { getEnvironmentConfig, validateEnvironment } from '../core/config/environment';
import type { EnvironmentConfig } from '../core/config/environment';

/**
 * ApiClient Context
 */
const ApiClientContext = createContext<ApiClient | null>(null);

/**
 * ApiClient Provider Props
 */
interface ApiClientProviderProps {
  children: ReactNode;
  config?: Partial<EnvironmentConfig>;
}

/**
 * ApiClient Provider
 * Creates and provides ApiClient instance to the app
 */
export function ApiClientProvider({ 
  children, 
  config = {} 
}: ApiClientProviderProps) {
  // Validate environment configuration
  if (process.env.NODE_ENV === 'production') {
    validateEnvironment();
  }

  // Get base configuration from environment
  const environmentConfig = getEnvironmentConfig();

  // Merge with any overrides passed as props
  const finalConfig: EnvironmentConfig = {
    ...environmentConfig,
    ...config,
  };

  // Create ApiClient instance
  const apiClient = new ApiClient(
    finalConfig,
    {
      getAccessToken: async () => {
        // TODO: Implement token retrieval from secure storage
        return null;
      },
      getRefreshToken: async () => {
        // TODO: Implement token retrieval from secure storage
        return null;
      },
      setAccessToken: async (token: string) => {
        // TODO: Implement token storage
        console.log('Access token set:', token);
      },
      setRefreshToken: async (token: string) => {
        // TODO: Implement token storage
        console.log('Refresh token set:', token);
      },
      clearTokens: async () => {
        // TODO: Implement token clearing
        console.log('Tokens cleared');
      },
    },
    () => {
      // Session expired callback
      // TODO: Implement session expiration handling (redirect to login)
      console.log('Session expired');
      // Optionally redirect to login: window.location.href = '/login';
    }
  );

  return (
    <ApiClientContext.Provider value={apiClient}>
      {children}
    </ApiClientContext.Provider>
  );
}

/**
 * Hook to use ApiClient
 * @throws Error if used outside of ApiClientProvider
 */
export function useApiClient(): ApiClient {
  const context = useContext(ApiClientContext);
  if (!context) {
    throw new Error('useApiClient must be used within an ApiClientProvider');
  }
  return context;
}

/**
 * Hook to get current environment configuration
 */
export function useEnvironmentConfig() {
  return getEnvironmentConfig();
}