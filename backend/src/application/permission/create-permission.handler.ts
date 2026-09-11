import { Validator } from '@/base/contracts/validator'
import { RequestHandler } from '@/base/mediator'
import { Injectable } from '@/base/util/injectable'
import { AuthService } from '@/base/util/auth-service'
import { Permission } from '@/domain/permission/permission'
import { PermissionRepository } from '@/domain/permission/permission-repository'
import { randomUUID } from 'node:crypto'
import type { CreatePermissionCommand } from './create-permission.command'
import { createPermissionSchema } from './create-permission.schema'

@Injectable()
export class CreatePermissionHandler implements RequestHandler<CreatePermissionCommand, unknown> {
  constructor(
    private readonly validator: Validator,
    private readonly permissionRepository: PermissionRepository,
    private readonly authService: AuthService,
  ) { }

  async handle(request: CreatePermissionCommand): Promise<unknown> {
    this.authService.authorizedTo('/roles/permisos')
    const input = this.validator.parse(createPermissionSchema, request.input)

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
