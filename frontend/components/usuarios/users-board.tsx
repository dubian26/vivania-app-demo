"use client"

import { useAppContext } from "@/contexts/app-context"
import { useAsync } from "@/hooks/use-async"
import { formatDate } from "@/lib/date-utility"
import type { RoleModel } from "@/models/role-model"
import type { UserResultModel } from "@/models/user-result-model"
import { createUserRepo } from "@/repositories/user-repository"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  UserX,
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { RolePermissionsDialog } from "./role-permissions-dialog"
import { UserCreateDialog } from "./user-create-dialog"
import { UserEditDialog } from "./user-edit-dialog"

interface Props {
  users: UserResultModel[]
  roles: RoleModel[]
  page: number
  hasMore: boolean
  search: string
  canCreate: boolean
  canEdit: boolean
  canDeactivate: boolean
  canManagePermissions: boolean
}

export function UsersBoard({
  users,
  roles,
  page,
  hasMore,
  search,
  canCreate,
  canEdit,
  canDeactivate,
  canManagePermissions,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const { showMessage } = useAppContext()
  const { run, loading } = useAsync()

  const [term, setTerm] = useState(search)
  const [createOpen, setCreateOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState<UserResultModel | null>(null)
  const [roleToManage, setRoleToManage] = useState<RoleModel | null>(null)
  const [userToDeactivate, setUserToDeactivate] =
    useState<UserResultModel | null>(null)

  // Server-side search: debounce the input and reflect it in the URL so the
  // server component refetches. Page resets by dropping the page param.
  useEffect(() => {
    if (term.trim() === search) return

    const timeout = setTimeout(() => {
      const params = new URLSearchParams()
      if (term.trim()) params.set("search", term.trim())
      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      })
    }, 400)

    return () => clearTimeout(timeout)
  }, [term, search, pathname, router])

  const goToPage = (next: number) => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (next > 1) params.set("page", String(next))
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const refresh = () => router.refresh()

  const handleDeactivate = async () => {
    if (!userToDeactivate) return

    const result = await run(
      createUserRepo().update(userToDeactivate.id, { active: false })
    )
    if (!result) return

    showMessage(result.message)
    setUserToDeactivate(null)
    refresh()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Buscar por nombre o email"
            className="pl-9"
            aria-label="Buscar usuarios"
          />
        </div>
        {canCreate && (
          <Button onClick={() => setCreateOpen(true)}>
            <Plus data-icon="inline-start" />
            Crear usuario
          </Button>
        )}
      </div>

      <div className="rounded-2xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No se encontraron usuarios.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {user.roleName ?? "Sin rol"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.active ? "secondary" : "destructive"}>
                      {user.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {canEdit && (
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Editar"
                              />
                            }
                            onClick={() => setUserToEdit(user)}
                          >
                            <Pencil />
                          </TooltipTrigger>
                          <TooltipContent>Editar</TooltipContent>
                        </Tooltip>
                      )}
                      {canManagePermissions && (
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Gestionar permisos"
                              />
                            }
                            onClick={() =>
                              setRoleToManage(
                                roles.find((role) => role.id === user.roleId) ??
                                  null
                              )
                            }
                          >
                            <ShieldCheck />
                          </TooltipTrigger>
                          <TooltipContent>Gestionar permisos</TooltipContent>
                        </Tooltip>
                      )}
                      {canDeactivate && user.active && (
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Desactivar"
                              />
                            }
                            onClick={() => setUserToDeactivate(user)}
                          >
                            <UserX />
                          </TooltipTrigger>
                          <TooltipContent>Desactivar</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Página {page}</p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft data-icon="inline-start" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(page + 1)}
            disabled={!hasMore}
          >
            Siguiente
            <ChevronRight data-icon="inline-end" />
          </Button>
        </div>
      </div>

      <UserCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={refresh}
      />
      <UserEditDialog
        user={userToEdit}
        roles={roles}
        onOpenChange={() => setUserToEdit(null)}
        onUpdated={refresh}
      />
      <RolePermissionsDialog
        role={roleToManage}
        onOpenChange={() => setRoleToManage(null)}
        onSaved={refresh}
      />

      {userToDeactivate && (
        <AlertDialogDeactivate
          user={userToDeactivate}
          loading={loading}
          onCancel={() => setUserToDeactivate(null)}
          onConfirm={handleDeactivate}
        />
      )}
    </div>
  )
}

interface DeactivateProps {
  user: UserResultModel
  loading: boolean
  onCancel: () => void
  onConfirm: () => void
}

function AlertDialogDeactivate({
  user,
  loading,
  onCancel,
  onConfirm,
}: DeactivateProps) {
  return (
    <AlertDialog open onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Desactivar usuario</AlertDialogTitle>
          <AlertDialogDescription>
            El usuario {user.firstName} {user.lastName} quedará inactivo y no
            podrá iniciar sesión. Esta acción se puede revertir editando el
            usuario.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && (
              <Loader2 className="animate-spin" data-icon="inline-start" />
            )}
            Desactivar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
