import { PermissionModel } from '../models/permission-model'
import { UserInfo } from '../models/user-info'
import { Injectable } from './injectable'
import { AsyncLocalStorage } from 'node:async_hooks'

export interface ContextModel {
  userInfo: UserInfo | undefined
  permissions: PermissionModel[]
}

@Injectable()
export class ContextStorage {
  private readonly storage = new AsyncLocalStorage<ContextModel>()

  get(): ContextModel | undefined {
    return this.storage.getStore()
  }

  set(context: ContextModel): void {
    this.storage.enterWith(context)
  }

  run<T>(context: ContextModel, work: () => T): T {
    return this.storage.run(context, work)
  }
}
