import { HttpClient, type HttpClientOptions } from "@/lib/http-client"
import type { IdResult } from "@/models/id-result"
import type { RegisterUserModel } from "@/models/register-user-model"
import type { UserInfoModel } from "@/models/user-info-model"
import type { UserResultModel } from "@/models/user-result-model"
import type { VerifyPurpose, VerifyUserResult } from "@/models/verify-user-result"

class UserRepository extends HttpClient {
  // Login: public route (POST /auth/login). The backend returns UserInfo
  // in the body and sets accessToken/refreshToken as httpOnly cookies.
  async authenticate(email: string, password: string): Promise<UserInfoModel | undefined> {
    const response = await this.fetch("/auth/login", { body: { email, password } })
    return this.getData<UserInfoModel>(response)
  }

  // NOTE: the backend does not implement /auth/google-login yet.
  // Once added, it receives { token } (Google credential) and returns UserInfo.
  async googleAuthenticate(token: string): Promise<UserInfoModel | undefined> {
    const response = await this.fetch("/auth/google-login", { body: { token } })
    return this.getData<UserInfoModel>(response)
  }

  async refreshToken(): Promise<UserInfoModel | undefined> {
    const response = await this.fetch("/auth/refresh-token", { method: "GET", cache: "no-store" })
    return this.getData<UserInfoModel>(response)
  }

  // Logout: the backend clears the httpOnly accessToken/refreshToken cookies.
  async logout(): Promise<void> {
    const response = await this.fetch("/auth/logout", { method: "POST" })
    await this.getData<void>(response)
  }

  // Registration: public route (POST /auth/register). Sends an OTP by email
  // and returns { id, message }. The user stays inactive until verified.
  async register(payload: RegisterUserModel): Promise<IdResult | undefined> {
    const response = await this.fetch("/auth/register", { body: payload })
    return this.getData<IdResult>(response)
  }

  // Verifies the OTP. On success the backend sets session cookies
  // (implicit login) and returns { message, userInfo }.
  async verifyEmail(
    email: string,
    code: string,
    purpose: VerifyPurpose = "REGISTRO"
  ): Promise<VerifyUserResult | undefined> {
    const response = await this.fetch("/auth/verify-email", {
      body: { email, code, purpose },
    })
    return this.getData<VerifyUserResult>(response)
  }

  // Resends the OTP (60s cooldown enforced by the backend).
  async resendOtp(
    email: string,
    purpose: VerifyPurpose = "REGISTRO"
  ): Promise<{ message: string } | undefined> {
    const response = await this.fetch("/auth/resend-otp", {
      body: { email, purpose },
    })
    return this.getData<{ message: string }>(response)
  }

  // Updates the authenticated user's profile (PATCH /auth/profile).
  // Requires a valid session cookie. verifyEmail with purpose RECUPERACION
  // sets those cookies (implicit login), so password recovery can reuse this.
  async updateProfile(
    payload: { password: string }
  ): Promise<IdResult | undefined> {
    const response = await this.fetch("/auth/profile", {
      method: "PATCH",
      body: payload,
    })
    return this.getData<IdResult>(response)
  }

  // Offset pagination over users (GET /users?skip&take[&search]).
  // Requires a valid session cookie.
  async search(params: {
    skip: number
    take: number
    search?: string
  }): Promise<UserResultModel[]> {
    const query = new URLSearchParams({
      skip: String(params.skip),
      take: String(params.take),
    })
    if (params.search) query.set("search", params.search)

    const response = await this.fetch(`/users?${query.toString()}`, {
      method: "GET",
      cache: "no-store",
    })
    const data = await this.getData<UserResultModel[]>(response)
    return data ?? []
  }

  // Admin-only partial update (PATCH /users/:id). Only `active` and
  // `roleId` can be changed; at least one field is required.
  async update(
    id: string,
    payload: { active?: boolean; roleId?: string }
  ): Promise<IdResult | undefined> {
    const response = await this.fetch(`/users/${id}`, {
      method: "PATCH",
      body: payload,
    })
    return this.getData<IdResult>(response)
  }
}

export const createUserRepo = (options: HttpClientOptions = {}) =>
  new UserRepository(options)
