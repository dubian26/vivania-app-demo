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
import { useAppContext } from "@/contexts/app-context"
import { useAsync } from "@/hooks/use-async"
import { UserModel } from '@/models/user-model'
import { createRoleRepo } from "@/repositories/role-repository"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface Props {
  open: boolean
  user?: UserModel | null
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

export function UserFormDialog({ open, user, onOpenChange, onSaved }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {
        open &&
        <UserForm
          key={user?.id ?? "create"}
          user={user ?? null}
          onOpenChange={onOpenChange}
          onSaved={onSaved}
        />
      }
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

  const [firstName, setFirstName] = useState(user?.firstName ?? "")
  const [lastName, setLastName] = useState(user?.lastName ?? "")

  const isValid = firstName.trim().length >= 3

  // The backend accepts name and description as optional on update, but on
  // edit both are always sent so clearing the description works.
  const handleSubmit = async () => {
    const repo = createRoleRepo()

    showMessage("OK submited")
    onOpenChange(false)
    onSaved()
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Editar usuario" : "Crear usuario"}</DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Actualiza los datos del usuario."
            : "Define un nuevo usuario que podrá acceder al sistema."}
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="user-form-first-name">Nombre</Label>
          <Input
            id="user-form-first-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="user-form-last-name">Apellido</Label>
          <Input
            id="user-form-last-name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            autoComplete="off"
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
          {loading && <Loader2 className="animate-spin" data-icon="inline-start" />}
          {isEdit ? "Guardar cambios" : "Crear usuario"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
