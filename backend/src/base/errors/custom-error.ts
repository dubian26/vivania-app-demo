import { ErrorDetail, ErrorType } from './error-model'

export class CustomError extends Error {
  readonly type: ErrorType
  readonly code: string
  readonly details: ErrorDetail[]

  constructor(
    message: string,
    type: ErrorType = 'validation',
    code: string = 'GenericError',
    details: ErrorDetail[] = [],
  ) {
    super(message)
    this.type = type
    this.code = code
    this.details = details
    Error.captureStackTrace(this, this.constructor)
  }
}
