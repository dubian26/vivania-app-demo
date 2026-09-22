"use client"

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import type { PermissionPath } from "@/lib/auth"
import { cn } from "@/lib/utils"
import type { ComponentProps, ReactNode } from "react"

type AuthButtonProps = ComponentProps<typeof Button> & {
  permissionPath: PermissionPath | PermissionPath[]
  description?: string
  children: ReactNode
}

/**
 * Botón que valida permisos automáticamente.
 * Si no tiene permiso, se deshabilita y muestra un mensaje en el tooltip.
 * Si tiene permiso, muestra la descripción de la acción en el tooltip (si se provee).
 */
export function AuthButton({
  permissionPath,
  description,
  children,
  className,
  disabled,
  ...props
}: AuthButtonProps) {
  const { authorizedTo, loading } = useAuth()
  const hasPermission = authorizedTo(permissionPath)

  // Mientras los permisos no estén registrados, se deshabilita por precaución.
  const isDisabled = loading || disabled || !hasPermission

  const tooltipContent = !hasPermission
    ? "No cuenta con el permiso para realizar esta acción."
    : description

  const buttonElement = (
    <Button
      {...props}
      disabled={isDisabled}
      className={cn(
        className,
        !hasPermission && "pointer-events-none opacity-50"
      )}
    >
      {children}
    </Button>
  )

  // Con permiso y sin descripción no se necesita tooltip.
  if (!tooltipContent) {
    return buttonElement
  }

  // El trigger es un span (vía render) para evitar anidar <button> dentro de
  // <button> y para que el hover llegue al tooltip aunque el botón esté
  // deshabilitado (pointer-events-none lo deja pasar al span).
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            className={cn(
              "inline-block",
              !hasPermission && "cursor-not-allowed"
            )}
          />
        }
      >
        {buttonElement}
      </TooltipTrigger>
      <TooltipContent>{tooltipContent}</TooltipContent>
    </Tooltip>
  )
}
