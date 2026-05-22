import { CustomError } from '@base/core/errors'

export class RoleError {
  static AlreadyExists() {
    return new CustomError(
      'El rol ya existe en la base de datos.',
      'validation',
      'Role.AlreadyExists',
    )
  }

  static NotExists() {
    return new CustomError(
      'El rol no existe en la base de datos.',
      'validation',
      'Role.NotExists',
    )
  }

  static InUse() {
    return new CustomError(
      'No se puede eliminar el rol, es posible que esté en uso.',
      'validation',
      'Role.InUse',
    )
  }
}
