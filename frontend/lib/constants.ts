// Google OAuth2 client id. NEXT_PUBLIC_* is inlined at build time so it
// can be read from Client Components. Empty means Google sign-in is disabled.
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""
