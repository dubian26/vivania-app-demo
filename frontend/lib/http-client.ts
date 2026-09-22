import { CustomError } from "@/lib/custom-error"
import { type ErrorModel } from "@/models/error-model"

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
type SessionExpiredHandler = () => void

export interface FetchOptions extends Omit<RequestInit, "method" | "body"> {
  method?: HttpMethod
  body?: unknown
}

export type HttpOptions = Omit<FetchOptions, "method">

export interface HttpClientOptions {
  baseUrl?: string
  cookie?: string
}

const FRONTEND_URL = process.env.FRONTEND_URL || "/api"
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000"
const REFRESH_TOKEN_PATH = "/auth/refresh-token"

const defaultBaseUrl = () => typeof window === "undefined" ? BACKEND_URL : FRONTEND_URL

// Invoked when the refresh token is no longer valid (definitive logout).
let onSessionExpired: SessionExpiredHandler = () => { }

// Client-only shared promise so concurrent 401s trigger a single refresh.
let clientRefreshPromise: Promise<boolean> | null = null

/**
 * Centralized HTTP client (native fetch).
 *
 * httpOnly cookies are sent automatically with credentials: "include".
 * On the server there is no cookie jar: pass the incoming request cookies
 * through HttpClientOptions.cookie and they will be forwarded upstream.
 *
 * Silent refresh: when the access token expires the backend answers 401
 * (type "token_expired"). The client renews it via GET /auth/refresh-token
 * and replays the original request once. On the server the renewed
 * Set-Cookie is merged into this.cookie so the retry carries the new token.
 */
export class HttpClient {
  cookie?: string
  protected readonly baseUrl: string
  private serverRefreshPromise: Promise<boolean> | null = null

  static setSessionExpiredHandler(handler: SessionExpiredHandler) {
    onSessionExpired = handler
  }

  constructor(options: HttpClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? defaultBaseUrl()
    this.cookie = options.cookie
  }

  private buildInit(options: FetchOptions): RequestInit {
    const { method = "POST", body, headers: rawHeaders, ...rest } = options
    const headers = new Headers(rawHeaders)
    const isJsonBody = HttpClient.isJsonBody(body)

    // Caller headers always win; only add JSON content-type when missing.
    if (isJsonBody && !headers.has("content-type")) {
      headers.set("content-type", "application/json")
    }

    if (this.cookie && !headers.has("cookie")) {
      headers.set("cookie", this.cookie)
    }

    const init: RequestInit = {
      ...rest,
      method,
      headers,
      credentials: rest.credentials ?? "include",
    }

    if (body != null && method !== "GET" && method !== "DELETE") {
      init.body = isJsonBody ? JSON.stringify(body) : (body as BodyInit)
    }

    return init
  }

  private static isJsonBody(
    body: unknown
  ): body is Record<string, unknown> | unknown[] {
    return (
      body !== null &&
      typeof body === "object" &&
      !(body instanceof FormData) &&
      !(body instanceof Blob) &&
      !(body instanceof URLSearchParams) &&
      !(body instanceof ArrayBuffer) &&
      !ArrayBuffer.isView(body) &&
      !(body instanceof ReadableStream)
    )
  }

  async http(
    method: HttpMethod,
    path: string,
    options: HttpOptions = {}
  ): Promise<Response> {
    const fetchOptions: FetchOptions = { ...options, method }
    const response = await this.request(path, fetchOptions)

    // Silent refresh: any 401 means the access token is no longer valid.
    // Renew it and replay the original request once.
    if (response.status !== 401) {
      return response
    }

    const refreshed = await this.refreshSession()
    if (!refreshed) {
      onSessionExpired()
      return response
    }

    return this.request(path, fetchOptions)
  }

  private async request(path: string, options: FetchOptions): Promise<Response> {
    try {
      const url = `${this.baseUrl}${path}`
      const init = this.buildInit(options)
      const response = await fetch(url, init)
      this.captureCookies(response)
      return response
    } catch {
      // Network error: the backend is down or unreachable
      throw CustomError.fromConnection()
    }
  }

  /**
   * Renews the access token using the refreshToken httpOnly cookie.
   * Concurrent calls share a single in-flight request (per instance on the
   * server, globally on the client).
   */
  private refreshSession(): Promise<boolean> {
    if (typeof window === "undefined") {
      this.serverRefreshPromise ??= this.performRefresh().finally(() => {
        this.serverRefreshPromise = null
      })
      return this.serverRefreshPromise
    }

    clientRefreshPromise ??= this.performRefresh().finally(() => {
      clientRefreshPromise = null
    })
    return clientRefreshPromise
  }

  private async performRefresh(): Promise<boolean> {
    try {
      const response = await this.request(REFRESH_TOKEN_PATH, {
        method: "GET",
        cache: "no-store",
      })
      return response.ok
    } catch {
      return false
    }
  }

  /**
   * On the server there is no cookie jar: keep the cookies returned by the
   * backend (e.g. the renewed accessToken) so subsequent calls reuse them.
   * In the browser the cookie jar is managed by the browser itself.
   */
  private captureCookies(response: Response): void {
    if (typeof window !== "undefined") return

    const headers = response.headers as Headers & {
      getSetCookie?: () => string[]
    }
    const setCookies = headers.getSetCookie?.() ?? []
    if (setCookies.length === 0) return

    const jar = new Map<string, string>()

    for (const part of (this.cookie ?? "").split(";")) {
      const separator = part.indexOf("=")
      if (separator === -1) continue
      jar.set(part.slice(0, separator).trim(), part.slice(separator + 1).trim())
    }

    for (const setCookie of setCookies) {
      const pair = setCookie.split(";", 1)[0]
      const separator = pair.indexOf("=")
      if (separator === -1) continue
      jar.set(pair.slice(0, separator).trim(), pair.slice(separator + 1).trim())
    }

    this.cookie = Array.from(jar, ([name, value]) => `${name}=${value}`).join("; ")
  }

  /**
   * Parses the response. If the backend responded with an ErrorModel
   * (401 token_expired, 422 validation, 500 uncontrolled) it is converted
   * into a CustomError so the alert context can display its message.
   */
  async getData<T>(
    response: Response,
    callerName: string = ""
  ): Promise<T | undefined> {
    if ([401, 422, 500].includes(response.status)) {
      const errorModel: ErrorModel = await response.json()
      throw CustomError.fromModel(errorModel)
    }

    if (!response.ok) {
      const caller = callerName ? callerName : HttpClient.getCallerName()
      throw CustomError.fromFetch(caller)
    }

    if (response.status === 204) return undefined
    const text = await response.text()
    if (!text || text === "null") return undefined
    return JSON.parse(text) as T
  }

  private static getCallerName = () => {
    const stack = new Error().stack
    const callerLine = stack?.split("\n")[2]
    const callerName = callerLine?.trim().split(" ")[1]
    return callerName ?? ""
  }
}
