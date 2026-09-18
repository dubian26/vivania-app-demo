"use client"

import { useAppContext } from "@/contexts/app-context"
import { useAsync } from "@/hooks/use-async"
import { buildPermissionTree } from "@/lib/permission-tree"
import type {
  PermissionModel,
  PermissionTreeModel,
} from "@/models/permission-model"
import type { RoleModel } from "@/models/role-model"
import { createPermissionRepo } from "@/repositories/permission-repository"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

interface Props {
  role: RoleModel | null
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

// The backend manages permissions per role, so the row action edits the
// permissions of the user's role.
export function RolePermissionsDialog({ role, onOpenChange, onSaved }: Props) {
  return (
    <Dialog open={!!role} onOpenChange={onOpenChange}>
      {role && (
        <RolePermissionsContent
          key={role.id}
          role={role}
          onOpenChange={onOpenChange}
          onSaved={onSaved}
        />
      )}
    </Dialog>
  )
}

interface ContentProps {
  role: RoleModel
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

function RolePermissionsContent({ role, onOpenChange, onSaved }: ContentProps) {
  const { run, loading } = useAsync(true)
  const { showMessage } = useAppContext()

  const [permissions, setPermissions] = useState<PermissionModel[]>([])
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    let ignore = false
    const load = async () => {
      const repository = createPermissionRepo()
      const result = await run(
        Promise.all([repository.listAll(), repository.listByRole(role.id)])
      )
      if (ignore || !result) return

      const [all, byRole] = result
      setPermissions(all)
      setCheckedIds(new Set(byRole.map((permission) => permission.id)))
    }

    load()
    return () => {
      ignore = true
    }
  }, [role.id, run])

  const tree = useMemo(() => buildPermissionTree(permissions), [permissions])

  // Checking a parent cascades to its descendants; a parent stays checked
  // only when all of its children are checked.
  const handleToggle = (node: PermissionTreeModel, checked: boolean) => {
    setCheckedIds((previous) => {
      const next = new Set(previous)

      for (const id of collectIds(node)) {
        if (checked) next.add(id)
        else next.delete(id)
      }

      const syncParent = (current: PermissionTreeModel): boolean => {
        if (current.children.length === 0) return next.has(current.id)

        const allChecked = current.children.map(syncParent).every(Boolean)
        if (allChecked) next.add(current.id)
        else next.delete(current.id)
        return allChecked
      }

      tree.forEach(syncParent)
      return next
    })
  }

  const isIndeterminate = (node: PermissionTreeModel): boolean =>
    !checkedIds.has(node.id) &&
    node.children.some(
      (child) => checkedIds.has(child.id) || isIndeterminate(child)
    )

  const handleSave = async () => {
    const result = await run(
      createPermissionRepo().saveRolePermissions(
        role.id,
        Array.from(checkedIds)
      )
    )
    if (!result) return

    showMessage(result.message)
    onOpenChange(false)
    onSaved()
  }

  return (
    <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>Permisos del rol {role.name}</DialogTitle>
        <DialogDescription>
          Los permisos se aplican a todos los usuarios con este rol.
        </DialogDescription>
      </DialogHeader>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : tree.length === 0 ? (
        <p className="py-4 text-sm text-muted-foreground">
          No hay permisos disponibles.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {tree.map((node) => (
            <PermissionNode
              key={node.id}
              node={node}
              checkedIds={checkedIds}
              isIndeterminate={isIndeterminate}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading && (
            <Loader2 className="animate-spin" data-icon="inline-start" />
          )}
          Guardar permisos
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

function collectIds(node: PermissionTreeModel): string[] {
  return [node.id, ...node.children.flatMap(collectIds)]
}

interface NodeProps {
  node: PermissionTreeModel
  checkedIds: Set<string>
  isIndeterminate: (node: PermissionTreeModel) => boolean
  onToggle: (node: PermissionTreeModel, checked: boolean) => void
}

function PermissionNode({
  node,
  checkedIds,
  isIndeterminate,
  onToggle,
}: NodeProps) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="cursor-pointer gap-2 py-1 font-normal">
        <Checkbox
          checked={checkedIds.has(node.id)}
          indeterminate={isIndeterminate(node)}
          onCheckedChange={(checked) => onToggle(node, checked)}
        />
        <span className="font-medium">{node.title}</span>
        <Badge variant={node.type === "MENU" ? "secondary" : "outline"}>
          {node.type === "MENU" ? "Menú" : "Acción"}
        </Badge>
        <span className="text-xs text-muted-foreground">{node.path}</span>
      </Label>

      {node.children.length > 0 && (
        <div className="ml-6 flex flex-col gap-1 border-l border-border pl-4">
          {node.children.map((child) => (
            <PermissionNode
              key={child.id}
              node={child}
              checkedIds={checkedIds}
              isIndeterminate={isIndeterminate}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}
