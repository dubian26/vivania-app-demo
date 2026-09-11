import { PipelineBehavior, Request } from '@/base/mediator'
import { Injectable } from '@/base/util/injectable'
import { Logger } from '@nestjs/common'
import { performance } from 'node:perf_hooks'

@Injectable()
export class LoggingBehavior implements PipelineBehavior {
  private readonly logger = new Logger(LoggingBehavior.name)

  async handle<TRequest extends Request<TResult>, TResult>(
    request: TRequest,
    next: () => Promise<TResult>,
  ): Promise<TResult> {
    const messageName = request.constructor.name
    const startedAt = performance.now()
    this.logger.log(`iniciando ${messageName}`)

    try {
      const result = await next()
      const durationMs = performance.now() - startedAt
      this.logger.log(`finalizado ${messageName} ${durationMs.toFixed(2)}ms`)
      return result
    } catch (error) {
      const durationMs = performance.now() - startedAt
      const errorName = error instanceof Error ? error.name : 'UnknownError'
      this.logger.warn(`falló ${messageName} ${errorName} ${durationMs.toFixed(2)}ms`)
      throw error
    }
  }
}
