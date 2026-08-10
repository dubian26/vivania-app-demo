import { PermissionRepository } from '@/domain/permission/permission-repository'
import { Injectable } from '@js-core/domain/util'
import { ZodValidator } from '@/shared/util/zod-validator'
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
    private readonly permissionRepository: PermissionRepository,
  ) { }

  async execute(input: GetPermissionsByRoleDTO) {
    input = ZodValidator.parse(schema, input)

    const permissions = await this.permissionRepository.listByRole(input.roleId)
    return permissions.map((permission) => permission.toResult())
  }
}