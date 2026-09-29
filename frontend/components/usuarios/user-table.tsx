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
import { useAppContext } from "@/contexts/app-context"
import { formatDate } from "@/lib/date-utility"
import type { UserModel } from "@/models/user-model"
import { createUserRepo } from "@/repositories/user-repository"
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

      await new Promise(resolve => setTimeout(resolve, 2000))

      setUsers(prev => [...prev, ...next.slice(0, PAGE_SIZE)])
      setHasMore(next.length > PAGE_SIZE)
    } catch (error) {
      showError(error)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, users.length, search, showError])

  return (
    <div className="flex w-full flex-col">
      <div className="w-full rounded-2xl border border-border">
        <Table aria-busy={loading}>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead className="hidden md:table-cell">Estado</TableHead>
              <TableHead className="hidden md:table-cell">Creado</TableHead>
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
                  No hay usuarios registrados.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.roleName}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.active ? "Activo" : "Inactivo"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell>
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
