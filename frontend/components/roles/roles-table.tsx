import { Badge } from "@/components/ui/badge"
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

interface Props {
  roles: RoleModel[]
}

export function RolesTable({ roles }: Props) {
  return (
    <div className="rounded-2xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Creado</TableHead>
            <TableHead>Actualizado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-24 text-center text-muted-foreground"
              >
                No hay roles registrados.
              </TableCell>
            </TableRow>
          ) : (
            roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>
                  <Badge variant="outline">{role.name}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {role.description ?? "Sin descripción"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(role.createdAt)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(role.updatedAt)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
