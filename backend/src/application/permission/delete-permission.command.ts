import { Validator } from '@/base/contracts/validator'
import { IdResult } from '@/base/models/id-result'
import { Injectable } from '@/base/util/injectable'
import { uuidCheck } from '@/base/util/zod-custom-schemas'
import { PermissionError } from '@/domain/permission/permission-error'
import { PermissionRepository } from '@/domain/permission/permission-repository'
import { AuthService } from '@/base/util/auth-service'

@Injectable()
export class DeletePermissionCommand {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly validator: Validator,
    private readonly authService: AuthService,
  ) { }

  async execute(id: string): Promise<IdResult> {
    this.authService.authorizedTo('/roles/permisos')
    this.validator.parse(uuidCheck(), id)

    const permission = await this.permissionRepository.findById(id)
    if (!permission) throw PermissionError.NotExists()

    const childrenCount = await this.permissionRepository.countChildren(id)
    if (childrenCount > 0) throw PermissionError.HasChildren()

    await this.permissionRepository.delete(id)

    return { id, message: 'Permiso eliminado con éxito.' }
  }
}
