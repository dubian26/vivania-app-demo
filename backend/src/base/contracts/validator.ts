import type { z } from 'zod'

export abstract class Validator {
  abstract parse<T>(schema: z.ZodType<T>, input: unknown): T
}
