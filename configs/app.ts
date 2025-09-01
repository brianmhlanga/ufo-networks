// Application configuration
export const appConfig = {
  url: process.env.APP_URL || 'http://localhost:3000',
  name: 'Review.co.zw',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',
    timeout: parseInt(process.env.API_TIMEOUT || '30000'),
  },
  database: {
    url: process.env.DATABASE_URL || '',
  },
} as const;

// Individual exports
export const appUrl = appConfig.url;
export const appName = appConfig.name;
export const appVersion = appConfig.version;
export const environment = appConfig.environment;

// Type definitions
export type AppConfig = typeof appConfig;
