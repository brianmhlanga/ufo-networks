# Configuration Files

This folder contains global configuration exports for the application.

## Structure

- `colors.ts` - Color configuration (primary, secondary)
- `email.ts` - Email configuration (sender email, user, password)
- `app.ts` - Application configuration (URL, environment, etc.)
- `index.ts` - Main export file that combines all configurations

## Usage

### Import individual configurations

```typescript
// Import specific values
import { primaryColor, secondaryColor } from '~/configs/colors';
import { senderEmail, emailUser, emailPassword } from '~/configs/email';
import { appUrl } from '~/configs/app';

// Import configuration objects
import { colors } from '~/configs/colors';
import { emailConfig } from '~/configs/email';
import { appConfig } from '~/configs/app';
```

### Import all configurations

```typescript
// Import everything from the main index
import { config, primaryColor, senderEmail, appUrl } from '~/configs';

// Or import the combined config object
import { config } from '~/configs';
console.log(config.colors.primary);
console.log(config.email.sender.email);
console.log(config.app.url);
```

## Environment Variables

The configurations use environment variables with sensible defaults:

### Colors
- No environment variables needed (hardcoded values)

### Email
- `SENDER_EMAIL` - Sender email address
- `EMAIL_USER` - Email username
- `EMAIL_PASSWORD` - Email password
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port
- `SMTP_SECURE` - Use secure connection (true/false)

### App
- `APP_URL` - Application URL
- `NODE_ENV` - Environment (development/production)
- `API_BASE_URL` - API base URL
- `API_TIMEOUT` - API timeout in milliseconds
- `DATABASE_URL` - Database connection URL

## Type Safety

All configurations are typed with TypeScript for better development experience:

```typescript
import type { ColorConfig, EmailConfig, AppConfig } from '~/configs';
```
