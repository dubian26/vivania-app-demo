import { Title } from "@/components/common/title"
import { UsersBoard } from "@/components/usuarios/users-board"
import { createPermissionRepo } from "@/repositories/permission-repository"
import { createRoleRepo } from "@/repositories/role-repository"
import { createUserRepo } from "@/repositories/user-repository"
import { cookies } from "next/headers"

const PAGE_SIZE = 10

interface Props {
  searchParams: Promise<{ search?: string; page?: string }>
}

export default async function UsuariosPage({ searchParams }: Props) {
  const params = await searchParams
  const search = params.search?.trim() || undefined
  const page = Math.max(1, Number(params.page) || 1)
  const skip = (page - 1) * PAGE_SIZE

  const cookieStore = await cookies()

  const userRepository = createUserRepo({ cookie: cookieStore.toString() })
  const userInfo = await userRepository.refreshToken()

  // Reuse the cookie refreshed above so protected calls do not refresh again.
  const cookie = userRepository.cookie
  const roleRepository = createRoleRepo({ cookie })
  const permissionRepository = createPermissionRepo({ cookie })

  const permissions = userInfo
    ? await permissionRepository.listByRole(userInfo.roleId)
    : []

  const [users, roles] = await Promise.all([
    userRepository.search({ skip, take: PAGE_SIZE + 1, search }),
    roleRepository.listAll(),
  ])

  const allowedPaths = new Set(permissions.map((permission) => permission.path))

  return (
    <div className="flex w-full max-w-5xl flex-col gap-5">
      <Title>Usuarios</Title>
      <UsersBoard
        users={users.slice(0, PAGE_SIZE)}
        roles={roles}
        page={page}
        hasMore={users.length > PAGE_SIZE}
        search={search ?? ""}
        canCreate={allowedPaths.has("/usuarios/nuevo")}
        canEdit={allowedPaths.has("/usuarios/editar")}
        canDeactivate={allowedPaths.has("/usuarios/inactivar")}
        canManagePermissions={allowedPaths.has("/roles/permisos")}
      />
    </div>
  )
}
