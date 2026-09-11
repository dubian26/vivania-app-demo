import { Request } from './message'

export interface RequestHandler<TRequest extends Request<TResult>, TResult> {
  handle(request: TRequest): Promise<TResult>
}
