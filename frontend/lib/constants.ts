// Requests leave the browser towards Next.js's own origin and
// next.config.ts proxies them to the backend (rewrite /api/* -> BACKEND_URL).
// This keeps httpOnly cookies same-origin and avoids requiring CORS.
export const API_URL = "/api"
