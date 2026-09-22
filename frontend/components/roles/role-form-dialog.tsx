"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAppContext } from "@/contexts/app-context"
import { useAsync } from "@/hooks/use-async"
import type { RoleModel } from "@/models/role-model"
import { createRoleRepo } from "@/repositories/role-repository"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface Props {
  open: boolean
  role?: RoleModel | null
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

// Unified create/edit dialog. Passing a role switches to edit mode (PUT /roles);
// otherwise it creates a new one (POST /roles). The key resets the fields when
// the dialog opens or the target role changes.
export function RoleFormDialog({ open, role, onOpenChange, onSaved }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <RoleForm
          key={role?.id ?? "create"}
          role={role ?? null}
          onOpenChange={onOpenChange}
          onSaved={onSaved}
        />
      )}
    </Dialog>
  )
}

interface FormProps {
  role: RoleModel | null
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

function RoleForm({ role, onOpenChange, onSaved }: FormProps) {
  const isEdit = role !== null
  const { run, loading } = useAsync()
  const { showMessage } = useAppContext()

  const [name, setName] = useState(role?.name ?? "")
  const [description, setDescription] = useState(role?.description ?? "")

  const isValid = name.trim().length >= 3

  // The backend accepts name and description as optional on update, but on
  // edit both are always sent so clearing the description works.
  const handleSubmit = async () => {
    const repo = createRoleRepo()
    const result = await run(
      role
        ? repo.update({
            id: role.id,
            name: name.trim(),
            description: description.trim(),
          })
        : repo.create({
            name: name.trim(),
            description: description.trim() || undefined,
          })
    )
    if (!result) return

    showMessage(result.message)
    onOpenChange(false)
    onSaved()
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Editar rol" : "Crear rol"}</DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Actualiza el nombre o la descripción del rol."
            : "Define un nuevo rol que podrá ser asignado a los usuarios."}
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="role-form-name">Nombre</Label>
          <Input
            id="role-form-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="role-form-description">Descripción</Label>
          <Textarea
            id="role-form-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Opcional"
          />
        </div>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={loading || !isValid}>
          {loading && (
            <Loader2 className="animate-spin" data-icon="inline-start" />
          )}
          {isEdit ? "Guardar cambios" : "Crear rol"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
