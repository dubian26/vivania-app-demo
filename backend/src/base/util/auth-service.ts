import { BaseError } from '../errors/base-error'
import { Injectable } from './injectable'
import { ContextStorage } from './context-storage'

@Injectable()
export class AuthService {
  constructor(
    private readonly contextStorage: ContextStorage,
  ) { }

  /**
  * Evalúa si el usuario actual tiene permiso para uno o varios paths.
  * Utiliza la abstracción IReqContext para obtener los permisos.
  * Si no tiene permiso, arroja un error de tipo NoAutorizado.
  */
  authorizedTo(paths: AppPermissionPath | AppPermissionPath[]) {
    const permissions = this.contextStorage.get()?.permissions || []

    const pathsToCheck = Array.isArray(paths) ? paths : [paths]
    const hasPermission = permissions.some(p =>
      p.active && pathsToCheck.includes(p.path)
    )

    if (!hasPermission) {
      throw BaseError.NoAutorizado()
    }
  }
}

/**
 * Tipos literales para los paths de permisos conocidos.
 * Deben coincidir con los definidos en el frontend.
 */
export type AppPermissionPath =
  | '/dashboard/acceso'
  | '/roles/nuevo'
  | '/roles/editar'
  | '/roles/inactivar'
  | '/roles/permisos'
  | '/usuarios/acceso'
  | '/usuarios/nuevo'
  | '/usuarios/editar'
  | '/usuarios/inactivar'
  | (string & {})
