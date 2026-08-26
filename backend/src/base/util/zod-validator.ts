import type { z } from 'zod'
import { Validator } from '../contracts/validator'
import { BaseError } from '../errors/base-error'
import type { ErrorDetail } from '../errors/error-model'
import { Injectable } from './injectable'

@Injectable()
export class ZodValidator extends Validator {
  parse<T>(schema: z.ZodType<T>, input: unknown): T {
    const result = schema.safeParse(input)
    if (result.success) return result.data

    const details: ErrorDetail[] = result.error.issues.map((issue) => ({
      property: issue.path.join('.'),
      message: issue.message,
    }))

    throw BaseError.ValidationError(details)
  }
}
