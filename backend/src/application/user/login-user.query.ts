import { type UserInfo } from '@/shared/models/user-info'
import { LoginUserValidator } from './login-user.validator'
import { Injectable } from '@/shared/util/injectable'

@Injectable()
export class LoginUserQuery {
  constructor(private readonly loginUserValidator: LoginUserValidator) {}

  async execute(req: unknown): Promise<UserInfo> {
    const validRequest = this.loginUserValidator.validate(req)

    const userInfo: UserInfo = {
      id: '123',
      email: validRequest.email,
      firstName: 'John',
      lastName: 'Doe',
      roleId: '1',
      roleName: 'Admin',
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))

    return userInfo
  }
}
