import { Injectable } from '@/base/util/injectable'
import { RequestHandler } from '@/base/mediator'
import { Validator } from '@/base/contracts/validator'
import { uuidCheck } from '@/base/util/zod-custom-schemas'
import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import type { GetRoleQuery } from './get-role.query'

@Injectable()
export class GetRoleHandler implements RequestHandler<GetRoleQuery, unknown> {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly validator: Validator,
  ) { }

  async handle(request: GetRoleQuery): Promise<unknown> {
    this.validator.parse(uuidCheck(), request.id)
    const role = await this.roleRepository.findById(request.id)
    if (!role) throw RoleError.NotExists()

    return role.toResult()
  }
}
