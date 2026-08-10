import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { UuidValidator } from '@/base/contracts/uuid.validator'
import { Injectable } from '@/base/util/injectable'

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
