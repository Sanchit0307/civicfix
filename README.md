# CivicFix Backend

Secure Express backend with:
- Helmet security headers
- CORS allowlist using environment variables
- Global + route-specific rate limiting
- Request body size limit
- Input sanitization and validation
- Centralized error handling

## Setup

1. Install dependencies:
   `npm install`
2. Create env file:
   copy `.env.example` to `.env`
3. Start server:
   `npm start`

## Environment Variables

- `PORT`: server port (default: `3000`)
- `CORS_ORIGIN`: comma-separated list of allowed origins

Example:
`CORS_ORIGIN=http://localhost:5500,http://127.0.0.1:5500`

## API

- `GET /api/health` -> health check
- `POST /api/generate-letter` -> generate complaint letter
