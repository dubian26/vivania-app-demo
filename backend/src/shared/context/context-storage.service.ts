import { PermissionModel, UserInfo } from '@js-core/domain/models'
import { Injectable } from '@js-core/domain/util'
import { AsyncLocalStorage } from 'node:async_hooks'

export interface RequestContext {
  userInfo: UserInfo | undefined
  permissions: PermissionModel[]
}

@Injectable()
export class ContextStorageService {
  private readonly storage = new AsyncLocalStorage<RequestContext>()

  getContext(): RequestContext | undefined {
    return this.storage.getStore()
  }

  setContext(context: RequestContext): void {
    this.storage.enterWith(context)
  }

  run<T>(context: RequestContext, work: () => T): T {
    return this.storage.run(context, work)
  }
}