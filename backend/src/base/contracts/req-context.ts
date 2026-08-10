import { UserInfo } from '../models/user-info'
import { PermissionModel } from '../models/permission-model'

export interface ReqContext {
  getPermissions(): PermissionModel[]
  getUser(): UserInfo | undefined
}
