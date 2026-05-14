export interface ErrorDetail {
  property: string
  message: string
}

export type ErrorType =
  'token_expired' |
  'validation' |
  'uncontrolled'

export interface ErrorModel {
  type: ErrorType
  code: string
  message: string
  traceId: string
  details: ErrorDetail[]
}
