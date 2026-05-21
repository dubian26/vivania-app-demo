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

  static InvalidCredentials() {
    return new CustomError(
      'Credenciales inválidas.',
      'validation',
      'User.InvalidCredentials',
    )
  }

  static EmailNotVerified() {
    return new CustomError(
      'El correo electrónico no ha sido verificado.',
      'validation',
      'User.EmailNotVerified',
    )
  }

  static EmailAlreadyVerified() {
    return new CustomError(
      'El correo electrónico ya ha sido verificado.',
      'validation',
      'User.EmailAlreadyVerified',
    )
  }
}
