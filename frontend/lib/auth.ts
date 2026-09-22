import { PermissionModel } from "@/models/permission-model"

/**
 * Tipos literales para los paths de permisos conocidos.
 * El uso de (string & {}) permite autocompletado para los literales definidos
 * sin restringir el uso de otros strings si fuera necesario.
 */
export type PermissionPath =
   | "/dashboard/acceso"
   | "/roles/nuevo"
   | "/roles/editar"
   | "/roles/inactivar"
   | "/roles/permisos"
   | "/usuarios/editar"
   | "/usuarios/inactivar"
   | (string & {})

class Auth {
   private permisosCache: PermissionModel[] = []
   private listeners: (() => void)[] = []

   /**
    * Establece el caché de permisos y notifica a los suscriptores.
    */
   setPermisos(permisos: PermissionModel[]) {
      this.permisosCache = permisos
      this.notifyListeners()
   }

   /**
    * Obtiene los permisos cacheados.
    */
   getPermisos(): PermissionModel[] {
      return this.permisosCache
   }

   /**
    * Evalúa si el usuario tiene permiso para uno o varios paths de forma síncrona.
    */
   authorizedTo(paths: PermissionPath | PermissionPath[]): boolean {
      if (this.permisosCache.length === 0) return false
      const pathsToCheck = Array.isArray(paths) ? paths : [paths]
      return this.permisosCache.some(p =>
         p.active && pathsToCheck.includes(p.path as PermissionPath)
      )
   }

   /**
    * Sistema de suscripción para que React sepa cuándo cambian los permisos.
    */
   subscribe(listener: () => void) {
      this.listeners.push(listener)
      return () => {
         this.listeners = this.listeners.filter(l => l !== listener)
      }
   }

   private notifyListeners() {
      this.listeners.forEach(l => l())
   }
}

export const auth = new Auth()
