import { ZodValidator } from '@/shared/util/zod-validator'
import { UuidValidator } from '@/base/contracts/uuid.validator'
import { Injectable } from '@/base/util/injectable'
import { z } from 'zod'

const schema = z.uuid({ message: 'El ID proporcionado no es un UUID válido' })

@Injectable()
export class ZodUuidValidator extends UuidValidator {
  validate(input: string): string {
    return ZodValidator.parse(schema, input)
  }
}
