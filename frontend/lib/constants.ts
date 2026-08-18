// Requests leave the browser towards Next.js's own origin and
// next.config.ts proxies them to the backend (rewrite /api/* -> BACKEND_URL).
// This keeps httpOnly cookies same-origin and avoids requiring CORS.
export const API_URL = "/api"

// Google OAuth2 client id. NEXT_PUBLIC_* is inlined at build time so it
// can be read from Client Components. Empty means Google sign-in is disabled.
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""
