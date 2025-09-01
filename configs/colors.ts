// Color configuration for the application
export const colors = {
  primary: '#185ff9', // Blue color
  secondary: '#2d3040', // Gray color
} as const;

// Individual color exports
export const primaryColor = colors.primary;
export const secondaryColor = colors.secondary;

// Type definitions
export type ColorConfig = typeof colors;
