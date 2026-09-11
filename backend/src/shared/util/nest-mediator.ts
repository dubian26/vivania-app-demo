import { Mediator, PipelineBehavior, Request, RequestHandler } from '@/base/mediator'
import { Injectable } from '@/base/util/injectable'
import { ModuleRef } from '@nestjs/core'

@Injectable()
export class NestMediator extends Mediator {
  constructor(private readonly moduleRef: ModuleRef) {
    super()
  }

  async send<TResult>(request: Request<TResult>): Promise<TResult> {
    const handler = await this.moduleRef.resolve<
      unknown,
      RequestHandler<Request<TResult>, TResult>
    >(request.handlerType, undefined, { strict: false })

    let next = (): Promise<TResult> => handler.handle(request)

    for (const behaviorType of [...request.behaviorTypes].reverse()) {
      const behavior = await this.moduleRef.resolve<unknown, PipelineBehavior>(
        behaviorType,
        undefined,
        { strict: false },
      )
      const current = next
      next = () => behavior.handle(request, current)
    }

    return next()
  }
}
