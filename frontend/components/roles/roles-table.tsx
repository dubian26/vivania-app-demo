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
import { cn } from "@/lib/utils"
import type { RoleModel } from "@/models/role-model"
import { createRoleRepo } from "@/repositories/role-repository"
import { CalendarDays, Shield } from "lucide-react"
import { useCallback, useRef, useState } from "react"
import { RolesRowActions } from "./roles-row-actions"

const PAGE_SIZE = 10

interface Props {
  initialRoles: RoleModel[]
  initialTotalRows: number
  search?: string
}

export function RolesTable({ initialRoles, initialTotalRows, search }: Props) {
  const { showError } = useAppContext()
  const [roles, setRoles] = useState(initialRoles)
  const [totalRows, setTotalRows] = useState(initialTotalRows)
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef(false)
  const hasMore = roles.length < totalRows

  const handleLoadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return

    loadingRef.current = true
    setLoading(true)

    try {
      const next = await createRoleRepo().search({
        skip: roles.length,
        take: PAGE_SIZE,
        search,
      })

      setRoles((prev) => [...prev, ...next.data])
      setTotalRows(next.totalRows)
    } catch (error) {
      showError(error)
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [hasMore, roles.length, search, showError])

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
                  <Shield
                    aria-hidden="true"
                    className="size-3.5 text-primary"
                  />
                  Nombre
                </span>
              </TableHead>
              <TableHead className="h-10 w-[30%] px-3">Descripción</TableHead>
              <TableHead className="h-10 w-[18%] px-3">
                <span className="flex items-center gap-2">
                  <CalendarDays
                    aria-hidden="true"
                    className="size-3.5 text-primary"
                  />
                  Creado
                </span>
              </TableHead>
              <TableHead className="h-10 w-[18%] px-3">Actualizado</TableHead>
              <TableHead className="h-10 w-[12%] px-3 text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="block divide-y-0 p-2 lg:table-row-group lg:p-0">
            {roles.length === 0 ? (
              <TableRow
                className={cn(
                  "grid grid-cols-1 rounded-lg border border-border/70",
                  "bg-content lg:table-row lg:rounded-none lg:border-x-0",
                  "lg:border-t-0 lg:border-b lg:bg-transparent"
                )}
              >
                <TableCell
                  colSpan={5}
                  className="col-span-1 block px-3 py-7 text-center text-sm text-muted-foreground lg:table-cell"
                >
                  No hay roles registrados.
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow
                  key={role.id}
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
                      title={role.name}
                    >
                      {role.name}
                    </span>
                    <span
                      className="block truncate text-xs leading-4 text-muted-foreground lg:hidden"
                      title={role.description ?? "Sin descripción"}
                    >
                      {role.description ?? "Sin descripción"}
                    </span>
                    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 pt-1.5 text-xs leading-4 text-muted-foreground lg:hidden">
                      <span>Creado: {formatDate(role.createdAt)}</span>
                      <span>Actualizado: {formatDate(role.updatedAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden min-w-0 text-muted-foreground lg:table-cell">
                    <span
                      className="block truncate text-sm"
                      title={role.description ?? "Sin descripción"}
                    >
                      {role.description ?? "Sin descripción"}
                    </span>
                  </TableCell>
                  <TableCell className="hidden min-w-0 text-sm text-muted-foreground lg:table-cell">
                    <span
                      className="block truncate"
                      title={formatDate(role.createdAt)}
                    >
                      {formatDate(role.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="hidden min-w-0 text-sm text-muted-foreground lg:table-cell">
                    <span
                      className="block truncate"
                      title={formatDate(role.updatedAt)}
                    >
                      {formatDate(role.updatedAt)}
                    </span>
                  </TableCell>
                  <TableCell className="w-fit justify-self-end p-0 lg:w-[12%] lg:p-3">
                    <RolesRowActions role={role} />
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
        loadedRows={roles.length}
        totalRows={totalRows}
        onLoadMore={handleLoadMore}
      />
    </div>
  )
}
