import { firstNameCheck, lastNameCheck, passCheck } from '@/base/util/zod-custom-schemas'
import { z } from 'zod'
import type { UpdateProfileDTO } from './update-profile.command'

export const updateProfileSchema = z.object({
  firstName: firstNameCheck().optional(),
  lastName: lastNameCheck().optional(),
  password: passCheck().optional(),
}).refine(
  data => data.firstName !== undefined ||
    data.lastName !== undefined ||
    data.password !== undefined, {
  message: 'Debe proporcionar al menos un campo para actualizar.',
}) satisfies z.ZodType<UpdateProfileDTO>
