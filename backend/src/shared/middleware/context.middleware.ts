import { ContextStorage } from '@/base/util/context-storage'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  constructor(private readonly contextStorage: ContextStorage) { }

  use(_req: FastifyRequest, _res: FastifyReply, next: () => void) {
    this.contextStorage.run({ userInfo: undefined, permissions: [] }, () => next())
  }
}
