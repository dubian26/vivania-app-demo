import { z } from 'zod'
import type { UpdatePermissionDTO } from './update-permission.command'

export const updatePermissionSchema = z.object({
  id: z.uuid({ message: 'El ID del permiso no es un UUID válido.' }),
  path: z.string()
    .min(1, { message: 'El path es obligatorio.' })
    .regex(
      /^\/[a-z0-9]+(-[a-z0-9]+)*(\/[a-z0-9]+(-[a-z0-9]+)*)*$/,
      { message: 'El path debe comenzar con "/" y contener solo letras minúsculas, números y "-"' },
    ),
  title: z.string().min(1, { message: 'El título es obligatorio.' }),
  type: z.enum(['MENU', 'ACTION'], { message: 'El tipo debe ser MENU o ACTION.' }),
  icon: z.string().nullable().optional(),
  order: z.number().int().optional(),
  active: z.boolean().optional(),
  parentId: z.uuid({ message: 'El ID del padre no es un UUID válido.' }).nullable().optional(),
}) satisfies z.ZodType<UpdatePermissionDTO>
