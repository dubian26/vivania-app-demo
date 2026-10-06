"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppContext } from "@/contexts/app-context"
import { useAsync } from "@/hooks/use-async"
import type { RoleModel } from "@/models/role-model"
import type { UserModel } from "@/models/user-model"
import { createRoleRepo } from "@/repositories/role-repository"
import { createUserRepo } from "@/repositories/user-repository"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface Props {
  open: boolean
  user?: UserModel | null
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

export function UserFormDialog({ open, user, onOpenChange, onSaved }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <UserForm
          key={user?.id ?? "create"}
          user={user ?? null}
          onOpenChange={onOpenChange}
          onSaved={onSaved}
        />
      )}
    </Dialog>
  )
}

interface FormProps {
  user: UserModel | null
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

function UserForm({ user, onOpenChange, onSaved }: FormProps) {
  const isEdit = user !== null
  const { run, loading } = useAsync()
  const { showMessage } = useAppContext()

  const [roles, setRoles] = useState<RoleModel[]>([])
  const [loadingRoles, setLoadingRoles] = useState(false)
  const [email, setEmail] = useState(user?.email ?? "")
  const [roleId, setRoleId] = useState(user?.roleId ?? "")
  const [firstName, setFirstName] = useState(user?.firstName ?? "")
  const [lastName, setLastName] = useState(user?.lastName ?? "")
  const [active, setActive] = useState(user?.active ?? false)

  useEffect(() => {
    let cancelled = false

    const loadRoles = async () => {
      setLoadingRoles(true)
      try {
        const result = await run(createRoleRepo().listAll())
        if (!cancelled && result) {
          setRoles(result)
          if (!isEdit && result.length > 0) {
            setRoleId((currentRoleId) => currentRoleId || result[0].id)
          }
        }
      } finally {
        if (!cancelled) setLoadingRoles(false)
      }
    }

    void loadRoles()

    return () => {
      cancelled = true
    }
  }, [run, isEdit])

  const trimmedFirstName = firstName.trim()
  const trimmedLastName = lastName.trim()
  const trimmedEmail = email.trim()

  const roleLabel =
    roles.find((role) => role.id === roleId)?.name ??
    (user ? user.roleName ?? roleId : roleId || "Selecciona un rol")

  const isCurrentRoleListed = roles.some((role) => role.id === roleId)
  const isDirty = user
    ? roleId !== user.roleId ||
    active !== user.active ||
    trimmedFirstName !== user.firstName ||
    trimmedLastName !== user.lastName
    : true
  const isBusy = loading

  const handleSubmit = async () => {
    if (user && !isDirty) return

    const repo = createUserRepo()

    const request = user
      ? repo.update({
        id: user.id,
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        roleId,
        active,
      })
      : repo.create({
        email: trimmedEmail,
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        roleId: roleId || undefined,
      })

    const result = await run(request)

    if (!result) return

    showMessage(result.message)
    onOpenChange(false)
    onSaved()
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Editar usuario" : "Crear usuario"}</DialogTitle>
        <DialogDescription>
          {isEdit
            ? `Actualiza los datos de ${user.email}.`
            : "Define un nuevo usuario. Quedará inactivo hasta que confirme su correo y elija una contraseña."}
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-5">
        {!isEdit && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="user-form-email">Correo electrónico</Label>
            <Input
              id="user-form-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="off"
              disabled={isBusy}
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor="user-form-first-name">Nombre</Label>
          <Input
            id="user-form-first-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            autoComplete="off"
            disabled={isBusy}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="user-form-last-name">Apellido</Label>
          <Input
            id="user-form-last-name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            autoComplete="off"
            disabled={isBusy}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="user-form-role">Rol</Label>
          <Select
            value={roleId}
            onValueChange={(value) => {
              if (value !== null) setRoleId(value)
            }}
          >
            <SelectTrigger
              id="user-form-role"
              className="w-full"
              disabled={isBusy}
              aria-label="Rol del usuario"
            >
              <SelectValue placeholder="Selecciona un rol">{roleLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {isEdit && !isCurrentRoleListed && roleId !== "" && (
                <SelectItem value={roleId}>
                  {user?.roleName ?? "Rol actual"}
                </SelectItem>
              )}
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loadingRoles && (
            <p className="text-sm text-muted-foreground" role="status">
              Cargando roles…
            </p>
          )}
        </div>

        {isEdit && (
          <div className="flex items-start gap-3">
            <Checkbox
              id="user-form-active"
              checked={active}
              onCheckedChange={(checked) => setActive(checked === true)}
              disabled={isBusy}
            />
            <div className="flex flex-col gap-1">
              <Label htmlFor="user-form-active">Usuario activo</Label>
              <p className="text-sm text-muted-foreground">
                Los usuarios inactivos no pueden acceder al sistema.
              </p>
            </div>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isBusy}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isBusy || (isEdit && !isDirty)}
        >
          {loading && !loadingRoles && (
            <Loader2 className="animate-spin" data-icon="inline-start" />
          )}
          {isEdit ? "Guardar cambios" : "Crear usuario"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
