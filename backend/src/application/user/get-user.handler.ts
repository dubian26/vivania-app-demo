import { Validator } from '@/base/contracts/validator'
import { RequestHandler } from '@/base/mediator'
import { Injectable } from '@/base/util/injectable'
import { uuidCheck } from '@/base/util/zod-custom-schemas'
import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { UserResult } from '@/domain/user/user'
import type { GetUserQuery } from './get-user.query'

@Injectable()
export class GetUserHandler implements RequestHandler<GetUserQuery, UserResult> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly validator: Validator,
  ) { }

  async handle(request: GetUserQuery): Promise<UserResult> {
    this.validator.parse(uuidCheck(), request.id)
    const user = await this.userRepository.findById(request.id)
    if (!user) throw UserError.NotExists()

    return user.toResult()
  }
}
