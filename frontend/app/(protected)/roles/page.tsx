import { Title } from "@/components/common/title"
import { RolesPagination } from "@/components/roles/roles-pagination"
import { RolesTable } from "@/components/roles/roles-table"
import { createRoleRepo } from "@/repositories/role-repository"
import { cookies } from "next/headers"

const PAGE_SIZE = 10

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function RolesPage({ searchParams }: Props) {
  const { page: rawPage } = await searchParams
  const page = Math.max(1, Number(rawPage) || 1)
  const skip = (page - 1) * PAGE_SIZE

  const cookieStore = await cookies()
  const roleRepository = createRoleRepo({ cookie: cookieStore.toString() })

  const roles = await roleRepository.search({
    skip,
    take: PAGE_SIZE + 1,
  })

  return (
    <div className="flex w-full max-w-5xl flex-col gap-5">
      <Title>Roles</Title>
      <RolesTable roles={roles.slice(0, PAGE_SIZE)} />
      <RolesPagination page={page} hasMore={roles.length > PAGE_SIZE} />
    </div>
  )
}
