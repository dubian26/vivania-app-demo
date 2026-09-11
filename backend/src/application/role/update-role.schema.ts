import type { UpdateRoleDTO } from './update-role.command'
import { z } from 'zod'

export const updateRoleSchema = z.object({
  id: z.uuid(),
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .regex(
      /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s]+$/,
      { message: 'El nombre contiene caracteres no válidos' },
    )
    .optional(),
  description: z.string()
    .optional()
    .refine(
      (value) => value === undefined || /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s.,;:!?\-_@#$%&()/+=]+$/.test(value),
      { message: 'La descripción contiene caracteres no válidos' },
    ),
}) satisfies z.ZodType<UpdateRoleDTO>
