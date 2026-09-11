import type { SearchRolesDTO } from './search-roles.query'
import { z } from 'zod'

export const searchRolesSchema = z.object({
  skip: z.coerce.number().int().min(0, { message: 'El valor de skip debe ser mayor o igual a 0' }),
  take: z.coerce.number().int().min(1, { message: 'El valor de take debe ser mayor o igual a 1' }),
  search: z.string().optional(),
}) satisfies z.ZodType<SearchRolesDTO>
