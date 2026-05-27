import { ZodValidator } from '@/shared/util/zod-validator'
import { UuidValidator } from '@base/core/contracts'
import { Injectable } from '@base/core/util'
import { z } from 'zod'

const schema = z.uuid({ message: 'El ID proporcionado no es un UUID válido' })

@Injectable()
export class ZodUuidValidator extends UuidValidator {
  validate(input: string): string {
    return ZodValidator.parse(schema, input)
  }
}
