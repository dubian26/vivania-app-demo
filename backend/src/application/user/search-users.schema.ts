import { z } from 'zod'
import type { SearchUsersDTO } from './search-users.query'

export const searchUsersSchema = z.object({
  skip: z.coerce.number().int().min(0, { message: 'El valor de skip debe ser mayor o igual a 0' }),
  take: z.coerce.number().int().min(1, { message: 'El valor de take debe ser mayor o igual a 1' }),
  search: z.string().optional(),
}) satisfies z.ZodType<SearchUsersDTO>
