import { PermissionRepository } from '@/domain/permission/permission-repository'
import { Injectable } from '@/base/util/injectable'

@Injectable()
export class ListPermissionsQuery {
  constructor(
    private readonly permissionRepository: PermissionRepository,
  ) { }

  async execute() {
    const permissions = await this.permissionRepository.listAll()
    return permissions.map((permission) => permission.toResult())
  }
}
