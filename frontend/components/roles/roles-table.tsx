import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { formatDate } from "@/lib/date-utility"
import type { RoleModel } from "@/models/role-model"
import { RolesRowActions } from "./roles-row-actions"

interface Props {
  roles: RoleModel[]
}

export function RolesTable({ roles }: Props) {
  return (
    <div className="w-full rounded-2xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead className="hidden md:table-cell">Descripción</TableHead>
            <TableHead className="hidden sm:table-cell">Creado</TableHead>
            <TableHead className="hidden lg:table-cell">Actualizado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                No hay roles registrados.
              </TableCell>
            </TableRow>
          ) : (
            roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>
                  {role.name}
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {role.description ?? "Sin descripción"}
                </TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">
                  {formatDate(role.createdAt)}
                </TableCell>
                <TableCell className="hidden text-muted-foreground lg:table-cell">
                  {formatDate(role.updatedAt)}
                </TableCell>
                <TableCell>
                  <RolesRowActions role={role} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
