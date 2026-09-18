"use client"

import { useAppContext } from "@/contexts/app-context"
import { useAsync } from "@/hooks/use-async"
import { createUserRepo } from "@/repositories/user-repository"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

// Creation reuses the public register flow: the backend assigns the
// "Cliente" role and the user must verify the email OTP before logging in.
export function UserCreateDialog({ open, onOpenChange, onCreated }: Props) {
  const { run, loading } = useAsync()
  const { showMessage } = useAppContext()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const isValid =
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    email.includes("@") &&
    password.length >= 7

  const handleSubmit = async () => {
    const result = await run(
      createUserRepo().register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      })
    )
    if (!result) return

    showMessage(result.message)
    setFirstName("")
    setLastName("")
    setEmail("")
    setPassword("")
    onOpenChange(false)
    onCreated()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear usuario</DialogTitle>
          <DialogDescription>
            Se enviará un código de verificación al email. El usuario deberá
            verificarlo antes de iniciar sesión.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="create-first-name">Nombres</Label>
              <Input
                id="create-first-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                autoComplete="given-name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="create-last-name">Apellidos</Label>
              <Input
                id="create-last-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                autoComplete="family-name"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="create-email">Email</Label>
            <Input
              id="create-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="create-password">Contraseña</Label>
            <PasswordInput
              password={password}
              disabled={loading}
              onChange={setPassword}
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
            Crear usuario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
