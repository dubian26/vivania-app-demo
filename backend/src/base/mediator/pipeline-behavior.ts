import { Request } from './message'

export interface PipelineBehavior {
  handle<TRequest extends Request<TResult>, TResult>(
    request: TRequest,
    next: () => Promise<TResult>,
  ): Promise<TResult>
}
