import { Permission } from '@/domain/permission/permission'
import { PermissionError } from '@/domain/permission/permission-error'
import { PermissionRepository } from '@/domain/permission/permission-repository'
import { AuthService } from '@/base/util/auth-service'
import { Validator } from '@/base/contracts/validator'
import { PermissionType } from '@/base/models/permission-model'
import { Injectable } from '@/base/util/injectable'
import { z } from 'zod'

export interface UpdatePermissionDTO {
  id: string
  path: string
  title: string
  type: PermissionType
  icon?: string | null
  order?: number
  active?: boolean
  parentId?: string | null
}

export const schema = z.object({
  id: z.uuid({ message: 'El ID del permiso no es un UUID válido.' }),
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
}) satisfies z.ZodType<UpdatePermissionDTO>

@Injectable()
export class UpdatePermissionCommand {
  constructor(
    private readonly validator: Validator,
    private readonly permissionRepository: PermissionRepository,
    private readonly authService: AuthService,
  ) { }

  async execute(input: UpdatePermissionDTO) {
    this.authService.authorizedTo('/roles/permisos')
    input = this.validator.parse(schema, input)

    const existing = await this.permissionRepository.findById(input.id)
    if (!existing) throw PermissionError.NotExists()

    if (existing.path !== input.path) {
      const childrenCount = await this.permissionRepository.countChildren(input.id)
      if (childrenCount > 0) throw PermissionError.HasChildren()
    }

    const updated = Permission.create({
      id: input.id,
      path: input.path,
      title: input.title,
      type: input.type,
      icon: input.icon ?? null,
      order: input.order ?? existing.order,
      active: input.active ?? existing.active,
      parentId: input.parentId ?? existing.parentId,
    })

    await this.permissionRepository.update(updated)

    return updated.toResult()
  }
}
