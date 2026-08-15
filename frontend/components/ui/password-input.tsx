"use client"

import { Eye, EyeClosed, Lock } from "lucide-react"
import { useState } from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface PasswordInputProps {
  password: string
  disabled?: boolean
  onChange: (password: string) => void
}

export function PasswordInput({
  password,
  disabled = false,
  onChange,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="group relative">
      <Lock
        className={cn(
          "absolute top-1/2 left-3 -translate-y-1/2",
          "text-muted-foreground transition-colors group-focus-within:text-primary"
        )}
        size={20}
      />
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        value={password}
        disabled={disabled}
        className="w-full pr-10 pl-10"
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        className={cn(
          "absolute top-1/2 right-3 -translate-y-1/2",
          "cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
        )}
      >
        {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
      </button>
    </div>
  )
}
