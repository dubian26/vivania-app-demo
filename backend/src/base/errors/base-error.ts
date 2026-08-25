import { CustomError } from './custom-error'
import type { ErrorDetail } from './error-model'

export class BaseError {
  static TokenNotFound() {
    return new CustomError(
      'No autorizado. Token inexistente.',
      'token_expired',
      'Auth.TokenNotFound',
    )
  }

  static InvalidToken() {
    return new CustomError(
      'Token inválido o expirado.',
      'token_expired',
      'Auth.InvalidToken',
    )
  }

  static MissingRefreshToken() {
    return new CustomError(
      'Token de refresco no encontrado.',
      'token_expired',
      'Auth.MissingRefreshToken',
    )
  }

  static SessionExpired() {
    return new CustomError(
      'Sesión expirada. Por favor, inicie sesión nuevamente.',
      'token_expired',
      'Auth.SessionExpired',
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

  static NoAutorizado() {
    return new CustomError(
      'No cuenta con el permiso para realizar esta acción.',
      'validation',
      'Auth.NoAutorizado',
    )
  }

  static ValidationError(details: ErrorDetail[]): CustomError {
    return new CustomError(
      'Errores de validación:',
      'validation',
      'Schema.ValidationError',
      details,
    )
  }
}
