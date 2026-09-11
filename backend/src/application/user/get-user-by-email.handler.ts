import { Validator } from '@/base/contracts/validator'
import { RequestHandler } from '@/base/mediator'
import { Injectable } from '@/base/util/injectable'
import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { UserResult } from '@/domain/user/user'
import type { GetUserByEmailQuery } from './get-user-by-email.query'
import { getUserByEmailSchema } from './get-user-by-email.schema'

@Injectable()
export class GetUserByEmailHandler implements RequestHandler<GetUserByEmailQuery, UserResult> {
  constructor(
    private readonly validator: Validator,
    private readonly userRepository: UserRepository,
  ) { }

  async handle(request: GetUserByEmailQuery): Promise<UserResult> {
    const input = this.validator.parse(getUserByEmailSchema, request.input)

    const user = await this.userRepository.findByEmail(input.email)
    if (!user) throw UserError.NotExists()

    return user.toResult()
  }
}
