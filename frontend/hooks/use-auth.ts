import { auth, type PermissionPath } from "@/lib/auth"
import { useCallback, useSyncExternalStore } from "react"

/**
 * Hook para usar la autorización en componentes de React.
 * Se suscribe a los cambios en el caché de permisos de la clase Auth.
 */
export const useAuth = () => {
   // useSyncExternalStore garantiza que el componente se re-renderice 
   // cuando el caché de permisos cambie.
   const permisos = useSyncExternalStore(
      (callback) => auth.subscribe(callback),
      () => auth.getPermisos()
   )

   /**
    * Evalúa si el usuario tiene permiso para uno o varios paths.
    */
   const authorizedTo = useCallback((paths: PermissionPath | PermissionPath[]) => {
      return auth.authorizedTo(paths)
   }, [])

   return {
      authorizedTo,
      loading: permisos.length === 0
   }
}
