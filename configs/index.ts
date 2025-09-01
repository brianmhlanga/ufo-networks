// Main configuration exports
export * from './colors';
export * from './email';
export * from './app';

// Combined configuration object
import { colors } from './colors';
import { emailConfig } from './email';
import { appConfig } from './app';

export const config = {
  colors,
  email: emailConfig,
  app: appConfig,
} as const;

// Type for the entire configuration
export type Config = typeof config;
