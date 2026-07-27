import { CustomError } from '@js-core/domain/errors'

export class PermissionError {
  static NotExists() {
    return new CustomError(
      'El permiso no existe.',
      'validation',
      'Permission.NotExists',
    )
  }

  static HasChildren() {
    return new CustomError(
      'No se puede realizar esta acción porque el permiso tiene hijos asociados.',
      'validation',
      'Permission.HasChildren',
    )
  }
}
