import { BaseError, ErrorDetail } from '@js-core/domain/errors'
import { z } from 'zod'

export class ZodValidator {
  static parse<T>(schema: z.ZodType<T>, input: unknown): T {
    const result = schema.safeParse(input)
    if (result.success) return result.data

    const details: ErrorDetail[] = result.error.issues.map((issue) => ({
      property: issue.path.join('.'),
      message: issue.message,
    }))

    throw BaseError.ValidationError(details)
  }
}
