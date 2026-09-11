import { Injectable } from '@/base/util/injectable'
import { RequestHandler } from '@/base/mediator'
import { RoleRepository } from '@/domain/role/role-repository'
import type { ListRolesQuery } from './list-roles.query'

@Injectable()
export class ListRolesHandler implements RequestHandler<ListRolesQuery, unknown[]> {
  constructor(private readonly roleRepository: RoleRepository) { }

  async handle(): Promise<unknown[]> {
    const roles = await this.roleRepository.listAll()
    return roles.map((role) => role.toResult())
  }
}
