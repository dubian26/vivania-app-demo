import { Validator } from '@/base/contracts/validator'
import { RequestHandler } from '@/base/mediator'
import { IdResult } from '@/base/models/id-result'
import { Injectable } from '@/base/util/injectable'
import { AuthService } from '@/base/util/auth-service'
import { uuidCheck } from '@/base/util/zod-custom-schemas'
import { PermissionError } from '@/domain/permission/permission-error'
import { PermissionRepository } from '@/domain/permission/permission-repository'
import type { DeletePermissionCommand } from './delete-permission.command'

@Injectable()
export class DeletePermissionHandler implements RequestHandler<DeletePermissionCommand, IdResult> {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly validator: Validator,
    private readonly authService: AuthService,
  ) { }

  async handle(request: DeletePermissionCommand): Promise<IdResult> {
    this.authService.authorizedTo('/roles/permisos')
    this.validator.parse(uuidCheck(), request.id)

    const permission = await this.permissionRepository.findById(request.id)
    if (!permission) throw PermissionError.NotExists()

    const childrenCount = await this.permissionRepository.countChildren(request.id)
    if (childrenCount > 0) throw PermissionError.HasChildren()

    await this.permissionRepository.delete(request.id)

    return { id: request.id, message: 'Permiso eliminado con éxito.' }
  }
}
