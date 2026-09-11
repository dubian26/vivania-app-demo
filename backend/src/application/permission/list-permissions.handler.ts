import { RequestHandler } from '@/base/mediator'
import { Injectable } from '@/base/util/injectable'
import { PermissionRepository } from '@/domain/permission/permission-repository'
import type { ListPermissionsQuery } from './list-permissions.query'

@Injectable()
export class ListPermissionsHandler implements RequestHandler<ListPermissionsQuery, unknown[]> {
  constructor(private readonly permissionRepository: PermissionRepository) { }

  async handle(): Promise<unknown[]> {
    const permissions = await this.permissionRepository.listAll()
    return permissions.map((permission) => permission.toResult())
  }
}
