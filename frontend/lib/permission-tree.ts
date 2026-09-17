import type { PermissionModel, PermissionTreeModel } from "@/models/permission-model"

// Builds a recursive tree from the flat permission list using parentId.
// Nodes whose parent is missing from the list are treated as roots, and
// every level is sorted by `order` (ascending).
export function buildPermissionTree(
  permissions: PermissionModel[]
): PermissionTreeModel[] {
  const nodes = new Map<string, PermissionTreeModel>()
  const roots: PermissionTreeModel[] = []

  permissions.forEach(permission => {
    nodes.set(permission.id, { ...permission, children: [] })
  })

  permissions.forEach(permission => {
    const node = nodes.get(permission.id)!

    const parent = permission.parentId ?
      nodes.get(permission.parentId) :
      undefined

    if (parent) parent.children.push(node)
    else roots.push(node)
  })

  const sortByOrder = (branch: PermissionTreeModel[]) => {
    branch.sort((a, b) => a.order - b.order)
    branch.forEach(node => sortByOrder(node.children))
  }

  sortByOrder(roots)

  return roots
}
