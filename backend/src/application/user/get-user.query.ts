import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { UuidValidator } from '@base/core/contracts'
import { Injectable } from '@base/core/util'

@Injectable()
export class GetUserQuery {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly validator: UuidValidator,
  ) { }

  async execute(id: string) {
    this.validator.validate(id)
    const user = await this.userRepository.findById(id)
    if (!user) throw UserError.NotExists()

    return user.toResult()
  }
}
