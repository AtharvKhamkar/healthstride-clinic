/**
 * Environment configuration for Next.js
 * Mirrors the Flutter EnvironmentConfig pattern
 */

export interface EnvironmentConfig {
  baseUrl: string;
  guestApiKey: string;
  xApiKey: string;
  xApiSecretKey: string;
  connectTimeout: number;
  receiveTimeout: number;
  sendTimeout: number;
}

/**
 * Get environment variable with fallback
 */
function getEnv(key: string, fallback: string = ''): string {
  return process.env[key] || fallback;
}

/**
 * Get numeric environment variable
 */
function getEnvNumber(key: string, fallback: number): number {
  const value = process.env[key];
  return value ? parseInt(value, 10) : fallback;
}

/**
 * Get current environment name
 */
function getEnvironment(): 'development' | 'production' {
  // Check for explicit environment variable first
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV;
  if (appEnv === 'production' || appEnv === 'development') {
    return appEnv;
  }

  // Use Next.js NODE_ENV
  return process.env.NODE_ENV === 'production' ? 'production' : 'development';
}

/**
 * Development environment configuration
 */
const development: EnvironmentConfig = {
  baseUrl: getEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:3001'),
  guestApiKey: getEnv('NEXT_PUBLIC_GUEST_API_KEY', ''),
  xApiKey: getEnv('NEXT_PUBLIC_X_API_KEY', ''),
  xApiSecretKey: getEnv('NEXT_PUBLIC_X_API_SECRET_KEY', ''),
  connectTimeout: getEnvNumber('NEXT_PUBLIC_CONNECT_TIMEOUT', 30000),
  receiveTimeout: getEnvNumber('NEXT_PUBLIC_RECEIVE_TIMEOUT', 30000),
  sendTimeout: getEnvNumber('NEXT_PUBLIC_SEND_TIMEOUT', 30000),
};

/**
 * Production environment configuration
 */
const production: EnvironmentConfig = {
  baseUrl: getEnv('NEXT_PUBLIC_API_BASE_URL', ''),
  guestApiKey: getEnv('NEXT_PUBLIC_GUEST_API_KEY', ''),
  xApiKey: getEnv('NEXT_PUBLIC_X_API_KEY', ''),
  xApiSecretKey: getEnv('NEXT_PUBLIC_X_API_SECRET_KEY', ''),
  connectTimeout: getEnvNumber('NEXT_PUBLIC_CONNECT_TIMEOUT', 30000),
  receiveTimeout: getEnvNumber('NEXT_PUBLIC_RECEIVE_TIMEOUT', 30000),
  sendTimeout: getEnvNumber('NEXT_PUBLIC_SEND_TIMEOUT', 30000),
};

/**
 * Get current environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const env = getEnvironment();
  return env === 'production' ? production : development;
}

/**
 * Validate environment configuration
 * Throws error if critical variables are missing
 */
export function validateEnvironment(): void {
  const config = getEnvironmentConfig();
  const env = getEnvironment();

  // Validate base URL in production
  if (env === 'production' && !config.baseUrl) {
    throw new Error(
      'NEXT_PUBLIC_API_BASE_URL is required in production environment'
    );
  }

  // Log configuration in development
  if (env === 'development') {
    console.log('Environment Configuration:', {
      environment: env,
      baseUrl: config.baseUrl,
      connectTimeout: `${config.connectTimeout}ms`,
      receiveTimeout: `${config.receiveTimeout}ms`,
      sendTimeout: `${config.sendTimeout}ms`,
      hasGuestApiKey: !!config.guestApiKey,
      hasXApiKey: !!config.xApiKey,
      hasXApiSecretKey: !!config.xApiSecretKey,
    });
  }
}

/**
 * Current environment configuration
 */
export const currentEnvironment = getEnvironmentConfig();