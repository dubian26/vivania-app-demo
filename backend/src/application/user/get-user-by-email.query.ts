import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { Injectable } from '@js-core/domain/util'
import { GetUserByEmailDTO } from './get-user-by-email.dto'
import { GetUserByEmailValidator } from './get-user-by-email.validator'

@Injectable()
export class GetUserByEmailQuery {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly validator: GetUserByEmailValidator,
  ) { }

  async execute(input: GetUserByEmailDTO) {
    this.validator.validate(input)

    const user = await this.userRepository.findByEmail(input.email)
    if (!user) throw UserError.NotExists()

    return user.toResult()
  }
}
