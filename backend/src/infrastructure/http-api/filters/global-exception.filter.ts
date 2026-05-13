import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { FastifyReply, FastifyRequest } from 'fastify'
import { CustomError } from '@/shared/errors/custom-error'
import { ErrorModel } from '@/shared/errors/error-model'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const request = ctx.getRequest<FastifyRequest>()
    const traceId = randomUUID().replace(/-/g, '')

    if (exception instanceof CustomError) {
      const errorResponse: ErrorModel = {
        type: exception.type,
        code: exception.code,
        message: exception.message,
        traceId,
        details: exception.details,
      }

      response
        .status(this.getStatusCodeFromCustomError(exception))
        .send(errorResponse)

      return
    }

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus()
      const exceptionResponse = exception.getResponse()
      const message = this.getHttpExceptionMessage(exceptionResponse, exception)

      const errorResponse: ErrorModel = {
        type: statusCode >= 500 ? 'uncontrolled' : 'validation',
        code: exception.name,
        message,
        traceId,
        details: [],
      }

      response.status(statusCode).send(errorResponse)

      return
    }

    this.logger.error(
      `Unhandled exception ${request.method} ${request.url} traceId=${traceId}`,
      exception instanceof Error ? exception.stack : undefined,
    )

    const errorResponse: ErrorModel = {
      type: 'uncontrolled',
      code: 'InternalServerError',
      message: 'Ha ocurrido un error inesperado en el servidor.',
      traceId,
      details: [],
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorResponse)
  }

  private getStatusCodeFromCustomError(error: CustomError): number {
    switch (error.type) {
      case 'token_expired':
        return HttpStatus.UNAUTHORIZED
      case 'validation':
        return HttpStatus.UNPROCESSABLE_ENTITY
      case 'uncontrolled':
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR
    }
  }

  private getHttpExceptionMessage(
    exceptionResponse: string | object,
    exception: HttpException,
  ): string {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse
    }

    type ExWithMessage = { message?: string | string[] }
    const message = (exceptionResponse as ExWithMessage).message

    if (Array.isArray(message)) {
      return message.join(', ')
    }

    if (typeof message === 'string') {
      return message
    }

    return exception.message
  }
}
