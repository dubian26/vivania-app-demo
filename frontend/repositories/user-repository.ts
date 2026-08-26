import { API_URL } from "@/lib/constants"
import { FetchUtility } from "@/lib/fetch-utility"
import type { IdResult } from "@/models/id-result"
import type { RegisterUserModel } from "@/models/register-user-model"
import type { UserInfoModel } from "@/models/user-info-model"
import type { VerifyPurpose, VerifyUserResult } from "@/models/verify-user-result"

export class UserApiRepository {
  // Login: public route (POST /auth/login). The backend returns UserInfo
  // in the body and sets accessToken/refreshToken as httpOnly cookies.
  async authenticate(
    email: string,
    password: string
  ): Promise<UserInfoModel | undefined> {
    const url = `${API_URL}/auth/login`
    const response = await FetchUtility.fetch(url, { email, password })
    const data = await FetchUtility.getData<UserInfoModel>(response)
    return data
  }

  // NOTE: the backend does not implement /auth/google-login yet.
  // Once added, it receives { token } (Google credential) and returns UserInfo.
  async googleAuthenticate(
    token: string
  ): Promise<UserInfoModel | undefined> {
    const url = `${API_URL}/auth/google-login`
    const response = await FetchUtility.fetch(url, { token })
    const data = await FetchUtility.getData<UserInfoModel>(response)
    return data
  }

  // Registration: public route (POST /auth/register). Sends an OTP by email
  // and returns { id, message }. The user stays inactive until verified.
  async register(payload: RegisterUserModel): Promise<IdResult | undefined> {
    const url = `${API_URL}/auth/register`
    const response = await FetchUtility.fetch(url, payload)
    const data = await FetchUtility.getData<IdResult>(response)
    return data
  }

  // Verifies the OTP. On success the backend sets session cookies
  // (implicit login) and returns { message, userInfo }.
  async verifyEmail(
    email: string,
    code: string,
    purpose: VerifyPurpose = "REGISTRO"
  ): Promise<VerifyUserResult | undefined> {
    const url = `${API_URL}/auth/verify-email`
    const response = await FetchUtility.fetch(url, { email, code, purpose })
    const data = await FetchUtility.getData<VerifyUserResult>(response)
    return data
  }

  // Resends the OTP (60s cooldown enforced by the backend).
  async resendOtp(
    email: string,
    purpose: VerifyPurpose = "REGISTRO"
  ): Promise<{ message: string } | undefined> {
    const url = `${API_URL}/auth/resend-otp`
    const response = await FetchUtility.fetch(url, { email, purpose })
    const data = await FetchUtility.getData<{ message: string }>(response)
    return data
  }

  // Updates the authenticated user's profile (PATCH /auth/profile).
  // Requires a valid session cookie. verifyEmail with purpose RECUPERACION
  // sets those cookies (implicit login), so password recovery can reuse this.
  async updateProfile(
    payload: { password: string }
  ): Promise<IdResult | undefined> {
    const url = `${API_URL}/auth/profile`
    const response = await FetchUtility.fetch(url, payload, "PATCH")
    const data = await FetchUtility.getData<IdResult>(response)
    return data
  }
}

export const userRepository = new UserApiRepository()
