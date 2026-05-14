import { CustomError } from './custom-error'
import type { ErrorDetail } from './error-model'

export class BaseError {
  static TokenInexistente() {
    return new CustomError(
      'No autorizado. Token inexistente.',
      'token_expired',
      'Auth.TokenInexistente',
    )
  }

  static TokenInvalido() {
    return new CustomError(
      'Token inválido o expirado.',
      'token_expired',
      'Auth.TokenInvalido',
    )
  }

  static RefreshTokenInexistente() {
    return new CustomError(
      'Token de refresco no encontrado.',
      'token_expired',
      'Auth.RefreshTokenInexistente',
    )
  }
  static SesionExpirada() {
    return new CustomError(
      'Sesión expirada. Por favor, inicie sesión nuevamente.',
      'token_expired',
      'Auth.SesionExpirada',
    )
  }
  static ErrorRefrescarToken() {
    return new CustomError(
      'Error al refrescar el token.',
      'token_expired',
      'Auth.ErrorRefrescarToken',
    )
  }
  static GoogleTokenInvalido() {
    return new CustomError(
      'Token de Google inválido o sin email.',
      'token_expired',
      'Auth.GoogleTokenInvalido',
    )
  }
  static GoogleAuthError(message: string) {
    return new CustomError(message, 'token_expired', 'Auth.GoogleAuthError')
  }
  static CodigoInvalido() {
    return new CustomError(
      'Código inválido o ya expirado.',
      'validation',
      'Auth.CodigoInvalido',
    )
  }
  static CodigoNoCorresponde() {
    return new CustomError(
      'El código no corresponde a este usuario.',
      'validation',
      'Auth.CodigoNoCorresponde',
    )
  }
  static CodigoExpirado() {
    return new CustomError(
      'El código ha expirado.',
      'validation',
      'Auth.CodigoExpirado',
    )
  }
  static ReintentoMuyPronto(segundos: number) {
    return new CustomError(
      `Debes esperar ${segundos} segundos antes de solicitar otro código.`,
      'validation',
      'Auth.ReintentoMuyPronto',
    )
  }
  static NoAutorizado() {
    return new CustomError(
      'No cuenta con el permiso para realizar esta acción.',
      'validation',
      'Auth.NoAutorizado',
    )
  }

  static ValidationError(details: ErrorDetail[]): CustomError {
    return new CustomError(
      'Errores de validación en los datos enviados.',
      'validation',
      'Schema.ValidationError',
      details,
    )
  }
}
