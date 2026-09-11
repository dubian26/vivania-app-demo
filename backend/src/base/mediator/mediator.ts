import { Request } from './message'

export abstract class Mediator {
  abstract send<TResult>(request: Request<TResult>): Promise<TResult>
}
