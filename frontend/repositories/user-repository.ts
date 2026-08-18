import { API_URL } from "@/lib/constants"
import { FetchUtility } from "@/lib/fetch-utility"
import { type UserInfoModel } from "@/models/user-info-model"

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
}

export const userRepository = new UserApiRepository()
