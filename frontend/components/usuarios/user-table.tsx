"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { ScrollPagination } from "@/components/common/scroll-pagination"
import { Badge } from "@/components/ui/badge"
import { useAppContext } from "@/contexts/app-context"
import { formatDate } from "@/lib/date-utility"
import { cn } from '@/lib/utils'
import type { UserModel } from "@/models/user-model"
import { createUserRepo } from "@/repositories/user-repository"
import { CalendarDays, UserRound } from "lucide-react"
import { useCallback, useState } from "react"
import { UserRowActions } from "./user-row-actions"

const PAGE_SIZE = 10

interface Props {
  initialUsers: UserModel[]
  initialHasMore: boolean
  search?: string
}

export function UserTable({ initialUsers, initialHasMore, search }: Props) {
  const { showError } = useAppContext()
  const [users, setUsers] = useState<UserModel[]>(initialUsers)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)

  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)

    try {
      const repository = createUserRepo()
      const next = await repository.search({
        skip: users.length,
        take: PAGE_SIZE + 1,
        search,
      })

      await new Promise((resolve) => setTimeout(resolve, 2000))

      setUsers((prev) => [...prev, ...next.slice(0, PAGE_SIZE)])
      setHasMore(next.length > PAGE_SIZE)
    } catch (error) {
      showError(error)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, users.length, search, showError])

  return (
    <div className="flex w-full flex-col">
      <div className="w-full overflow-hidden rounded-xl border border-border bg-card">
        <Table
          aria-busy={loading}
          className="block w-full lg:table lg:table-fixed"
        >
          <TableHeader className="hidden lg:table-header-group">
            <TableRow className="[&>th]:font-semibold">
              <TableHead className="h-10 w-[22%] px-3">
                <span className="flex items-center gap-2">
                  <UserRound
                    aria-hidden="true"
                    className="size-3.5 text-primary"
                  />
                  Nombre
                </span>
              </TableHead>
              <TableHead className="h-10 w-[23%] px-3">Email</TableHead>
              <TableHead className="h-10 w-[15%] px-3">Rol</TableHead>
              <TableHead className="h-10 w-[12%] px-3">Estado</TableHead>
              <TableHead className="h-10 w-[20%] px-3">
                <span className="flex items-center gap-2">
                  <CalendarDays
                    aria-hidden="true"
                    className="size-3.5 text-primary"
                  />
                  Creado
                </span>
              </TableHead>
              <TableHead className="h-10 w-[8%] px-3 text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="block divide-y-0 p-2 lg:table-row-group lg:p-0">
            {users.length === 0 ? (
              <TableRow className={cn(
                "grid grid-cols-1 rounded-lg border border-border/70",
                "bg-content lg:table-row lg:rounded-none lg:border-x-0",
                "lg:border-t-0 lg:border-b lg:bg-transparent"
              )}>
                <TableCell
                  colSpan={6}
                  className={cn(
                    "col-span-1 block px-3 py-7 text-center",
                    "text-sm text-muted-foreground lg:table-cell"
                  )}
                >
                  No hay usuarios registrados.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className={cn(
                    "mb-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2",
                    "rounded-lg border border-border/70 bg-content px-2.5 py-2",
                    "transition-colors last:mb-0 hover:bg-muted/40",
                    "lg:mb-0 lg:table-row lg:rounded-none lg:border-x-0",
                    "lg:border-t-0 lg:border-b lg:bg-transparent",
                    "lg:px-0 lg:py-0 lg:hover:bg-muted/40"
                  )}
                >
                  <TableCell className="min-w-0 p-0 lg:p-3">
                    <span
                      className="block truncate text-sm leading-5 font-medium text-foreground"
                      title={`${user.firstName} ${user.lastName}`}
                    >
                      {user.firstName} {user.lastName}
                    </span>
                    <span
                      className="block truncate text-xs leading-4 text-muted-foreground lg:hidden"
                      title={user.email}
                    >
                      {user.email}
                    </span>
                    <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 pt-1.5 lg:hidden">
                      <Badge
                        variant="outline"
                        className="h-5 max-w-28 px-1.5 text-xs font-medium text-muted-foreground"
                        title={user.roleName}
                      >
                        <span className="truncate">{user.roleName}</span>
                      </Badge>
                      <UserStatus active={user.active} />
                      <span className="text-xs leading-4 text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden min-w-0 lg:table-cell">
                    <span className="block truncate text-sm" title={user.email}>
                      {user.email}
                    </span>
                  </TableCell>
                  <TableCell className="hidden min-w-0 lg:table-cell">
                    <span
                      className="block truncate text-sm"
                      title={user.roleName}
                    >
                      {user.roleName}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <UserStatus active={user.active} />
                  </TableCell>
                  <TableCell className="hidden min-w-0 text-sm text-muted-foreground lg:table-cell">
                    <span
                      className="block w-full truncate"
                      title={formatDate(user.createdAt)}
                    >
                      {formatDate(user.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="w-fit justify-self-end p-0 lg:w-[8%] lg:p-3">
                    <UserRowActions user={user} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ScrollPagination
        loading={loading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  )
}

function UserStatus({ active }: { active: boolean }) {
  return (
    <Badge
      variant="outline"
      className={
        active
          ? "h-5 border-primary/20 bg-primary/10 px-1.5 text-xs font-medium text-primary"
          : "h-5 border-border bg-muted px-1.5 text-xs font-medium text-muted-foreground"
      }
    >
      {active ? "Activo" : "Inactivo"}
    </Badge>
  )
}
