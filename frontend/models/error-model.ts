export interface ErrorDetail {
  property: string
  message: string
}

// Backend error contract (GlobalExceptionFilter)
export interface ErrorModel {
  type: string
  code: string
  message: string
  traceId: string
  details: ErrorDetail[]
}
