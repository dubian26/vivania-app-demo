import { BaseError } from '@js-core/domain'
import { Injectable } from '@js-core/domain/util'
import { ContextStorageService } from '../context/context-storage.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly contextStorage: ContextStorageService,
  ) { }

  /**
  * Evalúa si el usuario actual tiene permiso para uno o varios paths.
  * Utiliza la abstracción IReqContext para obtener los permisos.
  * Si no tiene permiso, arroja un error de tipo NoAutorizado.
  */
  authorizedTo(paths: AppPermissionPath | AppPermissionPath[]) {
    const permissions = this.contextStorage.getContext()?.permissions || []

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
  | '/contenido/nuevo'
  | '/contenido/editar'
  | '/contenido/eliminar'
  | '/usuarios/editar'
  | '/usuarios/inactivar'
  | '/productos/nuevo'
  | '/productos/editar'
  | '/productos/inactivar'
  | '/pedidos/acceso'
  | '/pedidos/gestionar'
  | '/mis-pedidos/acceso'
  | (string & {})
