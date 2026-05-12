import { type UserInfo } from '@/shared/models/user-info'
import { LoginUserDTO } from './login-user.dto'
import { schema } from './login-user.schema'
import { Injectable } from '@/shared/util/injectable'

@Injectable()
export class LoginUserQuery {
  async execute(req: LoginUserDTO): Promise<UserInfo> {
    schema.parse(req)

    const userInfo: UserInfo = {
      id: '123',
      email: req.email,
      firstName: 'John',
      lastName: 'Doe',
      roleId: '1',
      roleName: 'Admin',
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))

    return userInfo
  }
}
