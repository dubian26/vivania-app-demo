export type HandlerType = abstract new (...args: never[]) => unknown

export abstract class Request<TResult> {
  declare readonly resultType: TResult
  abstract readonly handlerType: HandlerType
  readonly behaviorTypes: HandlerType[] = []
}

export abstract class Command<TResult> extends Request<TResult> {
}

export abstract class Query<TResult> extends Request<TResult> {
}
