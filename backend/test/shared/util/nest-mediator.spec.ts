import { Command, PipelineBehavior, RequestHandler } from '@/base/mediator'
import { NestMediator } from '@/shared/util/nest-mediator'
import { Test } from '@nestjs/testing'

class PlainCommand extends Command<string> {
  readonly handlerType = PlainHandler

  constructor(readonly value: string) {
    super()
  }
}

class PlainHandler implements RequestHandler<PlainCommand, string> {
  handle(request: PlainCommand): Promise<string> {
    return Promise.resolve(request.value.toUpperCase())
  }
}

class BehaviorsCommand extends Command<string> {
  readonly handlerType = BehaviorsHandler
  readonly behaviorTypes = [SpyBehavior, SecondBehavior]

  constructor(readonly value: string) {
    super()
  }
}

class BehaviorsHandler implements RequestHandler<BehaviorsCommand, string> {
  handle(request: BehaviorsCommand): Promise<string> {
    events.push('handler')
    return Promise.resolve(request.value.toUpperCase())
  }
}

class SpyBehavior implements PipelineBehavior {
  handle<TRequest extends Command<TResult>, TResult>(
    _request: TRequest,
    next: () => Promise<TResult>,
  ): Promise<TResult> {
    events.push('spy:before')
    return next().then((result) => {
      events.push('spy:after')
      return result
    })
  }
}

class SecondBehavior implements PipelineBehavior {
  handle<TRequest extends Command<TResult>, TResult>(
    _request: TRequest,
    next: () => Promise<TResult>,
  ): Promise<TResult> {
    events.push('second:before')
    return next().then((result) => {
      events.push('second:after')
      return result
    })
  }
}

const events: string[] = []

describe('NestMediator', () => {
  beforeEach(() => {
    events.length = 0
  })

  it('resuelve el handler declarado por el comando sin un registry', async () => {
    const module = await Test.createTestingModule({
      providers: [NestMediator, PlainHandler],
    }).compile()
    const mediator = module.get(NestMediator)

    await expect(mediator.send(new PlainCommand('role'))).resolves.toBe('ROLE')
  })

  it('ejecuta los behaviors declarados envolviendo al handler en orden', async () => {
    const module = await Test.createTestingModule({
      providers: [NestMediator, BehaviorsHandler, SpyBehavior, SecondBehavior],
    }).compile()
    const mediator = module.get(NestMediator)

    const result = await mediator.send(new BehaviorsCommand('role'))

    expect(result).toBe('ROLE')
    expect(events).toEqual([
      'spy:before',
      'second:before',
      'handler',
      'second:after',
      'spy:after',
    ])
  })
})
