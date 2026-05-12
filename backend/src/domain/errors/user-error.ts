import { CustomError } from '@/shared/errors/custom-error'

export class UserError {
  static AlreadyExists() {
    return new CustomError(
      'El usuario ya existe en la base de datos.',
      'validation',
      'User.AlreadyExists',
    )
  }

  static NotExists() {
    return new CustomError(
      'El usuario no existe en la base de datos.',
      'validation',
      'User.NotExists',
    )
  }
}
