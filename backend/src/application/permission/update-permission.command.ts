import { UpdatePermissionDTO } from './update-permission.dto'
import { UpdatePermissionValidator } from './update-permission.validator'
import { Permission } from '@/domain/permission/permission'
import { PermissionError } from '@/domain/permission/permission-error'
import { PermissionRepository } from '@/domain/permission/permission-repository'
import { AuthService } from '@/shared/util/auth-service'
import { Injectable } from '@js-core/domain/util'

@Injectable()
export class UpdatePermissionCommand {
  constructor(
    private readonly validator: UpdatePermissionValidator,
    private readonly permissionRepository: PermissionRepository,
    private readonly authService: AuthService,
  ) { }

  async execute(input: UpdatePermissionDTO) {
    this.authService.authorizedTo('/roles/permisos')
    this.validator.validate(input)

    const existing = await this.permissionRepository.findById(input.id)
    if (!existing) throw PermissionError.NotExists()

    if (existing.path !== input.path) {
      const childrenCount = await this.permissionRepository.countChildren(input.id)
      if (childrenCount > 0) throw PermissionError.HasChildren()
    }

    const updated = Permission.create({
      id: input.id,
      path: input.path,
      title: input.title,
      type: input.type,
      icon: input.icon ?? null,
      order: input.order ?? existing.order,
      active: input.active ?? existing.active,
      parentId: input.parentId ?? existing.parentId,
    })

    await this.permissionRepository.update(updated)

    return updated.toResult()
  }
}