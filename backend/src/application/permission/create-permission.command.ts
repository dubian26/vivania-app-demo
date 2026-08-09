import { CreatePermissionDTO } from './create-permission.dto'
import { CreatePermissionValidator } from './create-permission.validator'
import { Permission } from '@/domain/permission/permission'
import { PermissionRepository } from '@/domain/permission/permission-repository'
import { AuthService } from '@/shared/util/auth-service'
import { Injectable } from '@js-core/domain/util'
import { randomUUID } from 'node:crypto'

@Injectable()
export class CreatePermissionCommand {
  constructor(
    private readonly validator: CreatePermissionValidator,
    private readonly permissionRepository: PermissionRepository,
    private readonly authService: AuthService,
  ) { }

  async execute(input: CreatePermissionDTO) {
    this.authService.authorizedTo('/roles/permisos')
    this.validator.validate(input)

    const permission = Permission.create({
      id: randomUUID(),
      path: input.path,
      title: input.title,
      type: input.type,
      icon: input.icon ?? null,
      order: input.order ?? 0,
      active: input.active ?? true,
      parentId: input.parentId ?? null,
    })

    await this.permissionRepository.insert(permission)

    return permission.toResult()
  }
}