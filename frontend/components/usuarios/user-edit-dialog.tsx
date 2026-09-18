"use client"

import { useAppContext } from "@/contexts/app-context"
import { useAsync } from "@/hooks/use-async"
import type { RoleModel } from "@/models/role-model"
import type { UserResultModel } from "@/models/user-result-model"
import { createUserRepo } from "@/repositories/user-repository"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface Props {
  user: UserResultModel | null
  roles: RoleModel[]
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}

// Admin edit only exposes the fields the backend accepts for now:
// role assignment and active status (PATCH /users/:id).
export function UserEditDialog({
  user,
  roles,
  onOpenChange,
  onUpdated,
}: Props) {
  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      {user && (
        <UserEditForm
          key={user.id}
          user={user}
          roles={roles}
          onOpenChange={onOpenChange}
          onUpdated={onUpdated}
        />
      )}
    </Dialog>
  )
}

interface FormProps {
  user: UserResultModel
  roles: RoleModel[]
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}

function UserEditForm({ user, roles, onOpenChange, onUpdated }: FormProps) {
  const { run, loading } = useAsync()
  const { showMessage } = useAppContext()

  const [roleId, setRoleId] = useState(user.roleId)
  const [active, setActive] = useState(user.active)

  const handleSubmit = async () => {
    const result = await run(
      createUserRepo().update(user.id, { roleId, active })
    )
    if (!result) return

    showMessage(result.message)
    onOpenChange(false)
    onUpdated()
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar usuario</DialogTitle>
        <DialogDescription>
          {user.firstName} {user.lastName} · {user.email}
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-role">Rol</Label>
          <Select
            value={roleId}
            onValueChange={(value) => setRoleId(value ?? "")}
          >
            <SelectTrigger id="edit-role" className="w-full">
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Label className="cursor-pointer gap-2">
          <Checkbox
            checked={active}
            onCheckedChange={(checked) => setActive(checked)}
          />
          Usuario activo
        </Label>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={loading || !roleId}>
          {loading && (
            <Loader2 className="animate-spin" data-icon="inline-start" />
          )}
          Guardar cambios
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
