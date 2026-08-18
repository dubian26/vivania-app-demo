import { CustomError } from "@/lib/custom-error"
import { type ErrorModel } from "@/models/error-model"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

/**
 * Centralized HTTP client (native fetch).
 *
 * httpOnly cookies are sent automatically with credentials: "include".
 * When protected routes are added, silent refresh (GET /auth/refresh-token)
 * can be wired here as a 401 response interceptor.
 */
export class FetchUtility {
  private static setParams(
    params: unknown,
    method: HttpMethod = "POST"
  ): RequestInit {
    const isFormData = params instanceof FormData

    const init: RequestInit = {
      method: method,
      // For FormData the browser sets Content-Type automatically with the
      // correct boundary; it must not be overridden manually.
      headers: isFormData ? {} : { "Content-Type": "application/json" },
      credentials: "include",
    }

    if (method !== "GET" && method !== "DELETE") {
      init.body = isFormData ? params : JSON.stringify(params)
    }

    return init
  }

  static async fetch(
    url: string,
    params: unknown,
    method: HttpMethod = "POST"
  ): Promise<Response> {
    const requestInit = FetchUtility.setParams(params, method)

    try {
      return await fetch(url, requestInit)
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
  static async getData<T>(
    response: Response,
    callerName: string = ""
  ): Promise<T | undefined> {
    if ([401, 422, 500].includes(response.status)) {
      const errorModel: ErrorModel = await response.json()
      throw CustomError.fromModel(errorModel)
    }

    if (!response.ok) {
      const caller = callerName ? callerName : FetchUtility.getCallerName()
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
