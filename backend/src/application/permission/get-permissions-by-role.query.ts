import { PermissionRepository } from '@/domain/permission/permission-repository'
import { Injectable } from '@/base/util/injectable'
import { Validator } from '@/base/contracts/validator'
import { z } from 'zod'

export interface GetPermissionsByRoleDTO {
  roleId: string
}

export const schema = z.object({
  roleId: z.uuid({ message: 'El ID del rol no es un UUID válido.' }),
}) satisfies z.ZodType<GetPermissionsByRoleDTO>

@Injectable()
export class GetPermissionsByRoleQuery {
  constructor(
    private readonly validator: Validator,
    private readonly permissionRepository: PermissionRepository,
  ) { }

  async execute(input: GetPermissionsByRoleDTO) {
    input = this.validator.parse(schema, input)

    const permissions = await this.permissionRepository.listByRole(input.roleId)
    return permissions.map((permission) => permission.toResult())
  }
}
