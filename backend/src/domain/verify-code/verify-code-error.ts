import { CustomError } from '@/base/errors/custom-error'

export class VerifyCodeError {
  static InvalidCode() {
    return new CustomError(
      'Código inválido o ya expirado.',
      'validation',
      'VerifyCode.CodigoInvalido'
    )
  }

  static CodeDoesNotMatch() {
    return new CustomError(
      'El código no corresponde a este usuario.',
      'validation',
      'VerifyCode.CodeDoesNotMatch'
    )
  }

  static CodeExpired() {
    return new CustomError(
      'El código ha expirado.',
      'validation',
      'VerifyCode.CodigoExpirado'
    )
  }

  static RetryVerySoon(sec: number) {
    return new CustomError(
      `Debes esperar ${sec} segundos antes de solicitar otro código.`,
      'validation',
      'VerifyCode.RetryVerySoon',
    )
  }
}
