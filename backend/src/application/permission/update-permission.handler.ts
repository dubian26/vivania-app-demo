import { Validator } from '@/base/contracts/validator'
import { RequestHandler } from '@/base/mediator'
import { Injectable } from '@/base/util/injectable'
import { AuthService } from '@/base/util/auth-service'
import { Permission } from '@/domain/permission/permission'
import { PermissionError } from '@/domain/permission/permission-error'
import { PermissionRepository } from '@/domain/permission/permission-repository'
import type { UpdatePermissionCommand } from './update-permission.command'
import { updatePermissionSchema } from './update-permission.schema'

@Injectable()
export class UpdatePermissionHandler implements RequestHandler<UpdatePermissionCommand, unknown> {
  constructor(
    private readonly validator: Validator,
    private readonly permissionRepository: PermissionRepository,
    private readonly authService: AuthService,
  ) { }

  async handle(request: UpdatePermissionCommand): Promise<unknown> {
    this.authService.authorizedTo('/roles/permisos')
    const input = this.validator.parse(updatePermissionSchema, request.input)

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
