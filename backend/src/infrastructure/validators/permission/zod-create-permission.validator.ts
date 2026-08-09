import { CreatePermissionDTO } from '@/application/permission/create-permission.dto'
import { CreatePermissionValidator } from '@/application/permission/create-permission.validator'
import { ZodValidator } from '@/shared/util/zod-validator'
import { Injectable } from '@js-core/domain/util'
import { z } from 'zod'

const schema = z.object({
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
})

@Injectable()
export class ZodCreatePermissionValidator extends CreatePermissionValidator {
  validate(input: CreatePermissionDTO): void {
    ZodValidator.parse(schema, input)
  }
}