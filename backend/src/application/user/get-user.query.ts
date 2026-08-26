import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { Validator } from '@/base/contracts/validator'
import { uuidCheck } from '@/base/util/zod-custom-schemas'
import { Injectable } from '@/base/util/injectable'

@Injectable()
export class GetUserQuery {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly validator: Validator,
  ) { }

  async execute(id: string) {
    this.validator.parse(uuidCheck(), id)
    const user = await this.userRepository.findById(id)
    if (!user) throw UserError.NotExists()

    return user.toResult()
  }
}
