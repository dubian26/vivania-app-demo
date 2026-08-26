import { Validator } from '@/base/contracts/validator'
import { PermissionType } from '@/base/models/permission-model'
import { Injectable } from '@/base/util/injectable'
import { Permission } from '@/domain/permission/permission'
import { PermissionRepository } from '@/domain/permission/permission-repository'
import { AuthService } from '@/base/util/auth-service'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

export interface CreatePermissionDTO {
  path: string
  title: string
  type: PermissionType
  icon?: string | null
  order?: number
  active?: boolean
  parentId?: string | null
}

export const schema = z.object({
  path: z.string()
    .min(1, { message: 'El path es obligatorio.' })
    .regex(
      /^\/[a-z0-9]+(-[a-z0-9]+)*(\/[a-z0-9]+(-[a-z0-9]+)*)*$/,
      { message: 'El path debe comenzar con "/" y contener solo letras minúsculas, números y "-"' }
    ),
  title: z.string().min(1, { message: 'El título es obligatorio.' }),
  type: z.enum(['MENU', 'ACTION'], { message: 'El tipo debe ser MENU o ACTION.' }),
  icon: z.string().nullable().optional(),
  order: z.number().int().optional(),
  active: z.boolean().optional(),
  parentId: z.uuid({ message: 'El ID del padre no es un UUID válido.' }).nullable().optional(),
}) satisfies z.ZodType<CreatePermissionDTO>

@Injectable()
export class CreatePermissionCommand {
  constructor(
    private readonly validator: Validator,
    private readonly permissionRepository: PermissionRepository,
    private readonly authService: AuthService,
  ) { }

  async execute(input: CreatePermissionDTO) {
    this.authService.authorizedTo('/roles/permisos')
    input = this.validator.parse(schema, input)

    const permission = Permission.create({
      id: randomUUID(),
      path: input.path,
      title: input.title,
      type: input.type,
      icon: input.icon ?? null,
      order: input.order ?? 0,
      active: input.active ?? true,
      parentId: input.parentId ?? null,
    })

    await this.permissionRepository.insert(permission)

    return permission.toResult()
  }
}
