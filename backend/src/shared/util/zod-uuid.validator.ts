import { ZodValidator } from '@/shared/util/zod-validator'
import { UuidValidator } from '@js-core/domain/contracts'
import { Injectable } from '@js-core/domain/util'
import { z } from 'zod'

const schema = z.uuid({ message: 'El ID proporcionado no es un UUID válido' })

@Injectable()
export class ZodUuidValidator extends UuidValidator {
  validate(input: string): string {
    return ZodValidator.parse(schema, input)
  }
}
