import type {
  UserModel,
  UserRegisterRequest,
  UserResendOtpRequest,
  UserUpdateProfileRequest,
  UserUpdateRequest,
  UserVerifyRequest,
  UserVerifyResult
} from "@/models/user-model"

import { HttpClient, type HttpClientOptions } from "@/lib/http-client"
import type { IdResult } from "@/models/id-result"
import type { SearchModel } from "@/models/search-model"
import type { UserInfoModel } from "@/models/user-info-model"

class UserRepository extends HttpClient {
  // Login: public route (POST /auth/login). The backend returns UserInfo
  // in the body and sets accessToken/refreshToken as httpOnly cookies.
  async authenticate(email: string, password: string): Promise<UserInfoModel | undefined> {
    const response = await this.http("POST", "/auth/login", { body: { email, password } })
    return this.getData<UserInfoModel>(response)
  }

  // NOTE: the backend does not implement /auth/google-login yet.
  // Once added, it receives { token } (Google credential) and returns UserInfo.
  async googleAuthenticate(token: string): Promise<UserInfoModel | undefined> {
    const response = await this.http("POST", "/auth/google-login", { body: { token } })
    return this.getData<UserInfoModel>(response)
  }

  async refreshToken(): Promise<UserInfoModel | undefined> {
    const response = await this.http("GET", "/auth/refresh-token", { cache: "no-store" })
    return this.getData<UserInfoModel>(response)
  }

  // Logout: the backend clears the httpOnly accessToken/refreshToken cookies.
  async logout(): Promise<void> {
    const response = await this.http("POST", "/auth/logout")
    await this.getData<void>(response)
  }

  // Registration: public route (POST /auth/register). Sends an OTP by email
  // and returns { id, message }. The user stays inactive until verified.
  async register(params: UserRegisterRequest): Promise<IdResult | undefined> {
    const response = await this.http("POST", "/auth/register", { body: params })
    return this.getData<IdResult>(response)
  }

  // Verifies the OTP. On success the backend sets session cookies
  // (implicit login) and returns { message, userInfo }.
  async verifyEmail(params: UserVerifyRequest): Promise<UserVerifyResult | undefined> {
    const response = await this.http("POST", "/auth/verify-email", { body: params })
    return this.getData<UserVerifyResult>(response)
  }

  // Resends the OTP (60s cooldown enforced by the backend).
  async resendOtp(params: UserResendOtpRequest): Promise<{ message: string } | undefined> {
    const response = await this.http("POST", "/auth/resend-otp", { body: params })
    return this.getData<{ message: string }>(response)
  }

  // Updates the authenticated user's profile (PATCH /auth/profile).
  // Requires a valid session cookie. verifyEmail with purpose RECUPERACION
  // sets those cookies (implicit login), so password recovery can reuse this.
  async updateProfile(params: UserUpdateProfileRequest): Promise<IdResult | undefined> {
    const response = await this.http("PATCH", "/auth/profile", { body: params })
    return this.getData<IdResult>(response)
  }

  // Offset pagination over users (GET /users?skip&take[&search]).
  // Requires a valid session cookie.
  async search(params: SearchModel): Promise<UserModel[]> {
    const query = new URLSearchParams({
      skip: String(params.skip),
      take: String(params.take),
    })

    if (params.search) query.set("search", params.search)

    const url = `/users?${query.toString()}`
    const response = await this.http("GET", url, { cache: "no-store" })
    const data = await this.getData<UserModel[]>(response)
    return data ?? []
  }

  // Admin-only partial update (PATCH /users/:id). Only `active` and
  // `roleId` can be changed; at least one field is required.
  async update(params: UserUpdateRequest): Promise<IdResult | undefined> {
    const url = `/users/${params.id}`
    const response = await this.http("PATCH", url, { body: params })
    return this.getData<IdResult>(response)
  }
}

export const createUserRepo = (options: HttpClientOptions = {}) =>
  new UserRepository(options)
