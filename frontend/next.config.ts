import type { NextConfig } from "next"

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:3000"

const nextConfig: NextConfig = {
  // Proxy same-origin hacia el backend NestJS: el navegador habla con
  // /api/* y Next reenvía la petición (con cookies) al backend.
  // Evita configurar CORS y permite las cookies httpOnly sameSite=strict.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ]
  },
}

export default nextConfig
