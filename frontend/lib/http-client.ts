import { CustomError } from "@/lib/custom-error"
import { type ErrorModel } from "@/models/error-model"

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export interface FetchOptions extends Omit<RequestInit, "method" | "body"> {
  method?: HttpMethod
  body?: unknown
}

export interface HttpClientOptions {
  baseUrl?: string
  cookie?: string
}

const FRONTEND_URL = process.env.FRONTEND_URL || "/api"
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000"

const defaultBaseUrl = () => typeof window === "undefined" ? BACKEND_URL : FRONTEND_URL

/**
 * Centralized HTTP client (native fetch).
 *
 * httpOnly cookies are sent automatically with credentials: "include".
 * On the server there is no cookie jar: pass the incoming request cookies
 * through HttpClientOptions.cookie and they will be forwarded upstream.
 */
export class HttpClient {
  readonly cookie?: string
  protected readonly baseUrl: string

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

  async fetch(path: string, options: FetchOptions = {}): Promise<Response> {
    try {
      const url = `${this.baseUrl}${path}`
      const init = this.buildInit(options)
      return await fetch(url, init)
    } catch {
      // Network error: the backend is down or unreachable
      throw CustomError.fromConnection()
    }
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
