# HealthStride Admin Portal

Next.js application for the HealthStride admin dashboard.

## Prerequisites

- Node.js 20+ 
- npm or yarn

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env.local
   ```

3. Update `.env.local` with your local configuration (or use `.env.development` for development)

## Environment Configuration

This project uses environment variables for configuration. The following variables are used:

### Required Variables

- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL (e.g., `http://localhost:3010`)

### Optional Variables

- `NEXT_PUBLIC_GUEST_API_KEY` - Guest API key
- `NEXT_PUBLIC_X_API_KEY` - X-Api-Key header value
- `NEXT_PUBLIC_X_API_SECRET_KEY` - X-Api-Secret-Key header value
- `NEXT_PUBLIC_CONNECT_TIMEOUT` - Connection timeout in ms (default: 30000)
- `NEXT_PUBLIC_RECEIVE_TIMEOUT` - Receive timeout in ms (default: 30000)
- `NEXT_PUBLIC_SEND_TIMEOUT` - Send timeout in ms (default: 30000)
- `NEXT_PUBLIC_APP_ENV` - Environment name: `development` or `production` (auto-detected from NODE_ENV if not set)

### Environment Files

- `.env.example` - Template for environment variables (commit to git)
- `.env.development` - Development environment defaults (commit to git)
- `.env.production` - Production configuration (commit to git, with placeholder values)
- `.env.local` - Local overrides (gitignored, for personal configs)

## Running the Application

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
  core/
    config/         # Environment configuration
    network/        # API client, interceptors, error handling
    constants/      # App constants
    types/          # TypeScript types
  providers/        # React context providers
  features/         # Feature modules (future)
  shared/           # Shared components and utilities
```

## API Client

The app uses a centralized `ApiClient` for all HTTP requests. It is provided via React Context (`ApiClientProvider`).

### Usage

```tsx
import { useApiClient } from '@/providers/ApiClientProvider';

function MyComponent() {
  const apiClient = useApiClient();

  const fetchData = async () => {
    try {
      const data = await apiClient.get('/api/endpoint');
      console.log(data);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  return <button onClick={fetchData}>Fetch Data</button>;
}
```

## Deployment

Deploy to Vercel or any Next.js-compatible platform. Set environment variables in your deployment platform's settings.

For production, ensure the following are configured:
- `NEXT_PUBLIC_API_BASE_URL` points to production API
- Timeout values are appropriate for production
- All API keys are set

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying)