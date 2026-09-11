import type { CreateRoleDTO } from './create-role.command'
import { z } from 'zod'

export const createRoleSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .regex(
      /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s]+$/,
      { message: 'El nombre contiene caracteres no válidos' },
    ),
  description: z.string()
    .optional()
    .refine(
      (value) => value === undefined || /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s.,;:!?\-_@#$%&()/+=]+$/.test(value),
      { message: 'La descripción contiene caracteres no válidos' },
    ),
}) satisfies z.ZodType<CreateRoleDTO>
