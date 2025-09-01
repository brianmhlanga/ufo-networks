// Email configuration for the application
export const emailConfig = {
  sender: {
    email: process.env.SENDER_EMAIL || 'noreply@review.co.zw',
    user: process.env.EMAIL_USER || 'noreply@review.co.zw',
    password: process.env.EMAIL_PASSWORD || '',
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
  },
} as const;

// Individual exports
export const senderEmail = emailConfig.sender.email;
export const emailUser = emailConfig.sender.user;
export const emailPassword = emailConfig.sender.password;

// Type definitions
export type EmailConfig = typeof emailConfig;
