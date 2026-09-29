import { Title } from "@/components/common/title"
import { RolesFilters } from "@/components/roles/roles-filters"
import { RolesPagination } from "@/components/roles/roles-pagination"
import { RolesTable } from "@/components/roles/roles-table"
import type { SearchModel, SearchParams } from "@/models/search-model"
import { createRoleRepo } from "@/repositories/role-repository"
import { cookies } from "next/headers"

const PAGE_SIZE = 10

interface Props {
  searchParams: Promise<SearchParams>
}

export default async function RolesPage({ searchParams }: Props) {
  const params = await searchParams
  const search = params.search?.trim() || undefined
  const page = Math.max(1, Number(params.page) || 1)

  // PAGE_SIZE + 1 detects whether there is a next page without a count query.
  const searchModel: SearchModel = {
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE + 1,
    search,
  }

  const cookieStore = await cookies()
  const cookie = cookieStore.toString()

  const roleRepository = createRoleRepo({ cookie })
  const roles = await roleRepository.search(searchModel)

  return (
    <div className="flex w-full flex-col gap-3">
      <Title>Roles</Title>
      <div className="flex w-full flex-col gap-3">
        <RolesFilters search={search ?? ""} />
        <RolesTable roles={roles.slice(0, PAGE_SIZE)} />
        <RolesPagination
          page={page}
          hasMore={roles.length > PAGE_SIZE}
          search={search}
        />
      </div>
    </div>
  )
}
