import { PermissionError } from '@/domain/permission/permission-error'
import { PermissionRepository } from '@/domain/permission/permission-repository'
import { AuthService } from '@/shared/util/auth-service'
import { IdResult } from '@js-core/domain/models'
import { UuidValidator } from '@js-core/domain/contracts'
import { Injectable } from '@js-core/domain/util'

@Injectable()
export class DeletePermissionCommand {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly validator: UuidValidator,
    private readonly authService: AuthService,
  ) { }

  async execute(id: string): Promise<IdResult> {
    this.authService.authorizedTo('/roles/permisos')
    this.validator.validate(id)

    const permission = await this.permissionRepository.findById(id)
    if (!permission) throw PermissionError.NotExists()

    const childrenCount = await this.permissionRepository.countChildren(id)
    if (childrenCount > 0) throw PermissionError.HasChildren()

    await this.permissionRepository.delete(id)

    return { id, message: 'Permiso eliminado con éxito.' }
  }
}