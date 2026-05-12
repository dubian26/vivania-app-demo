import { z } from 'zod'

export const schema = z.object({
  email: z.email({ message: 'El email no es válido.' }),
  password: z.string().min(1, { message: 'La contraseña es requerida.' }),
})
