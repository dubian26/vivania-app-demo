import { RolesFilters } from "@/components/roles/roles-filters"
import { RolesTable } from "@/components/roles/roles-table"
import type { SearchParams } from "@/models/search-model"
import { createRoleRepo } from "@/repositories/role-repository"
import { cookies } from "next/headers"
import { randomUUID } from "node:crypto"

const PAGE_SIZE = 10

interface Props {
  searchParams: Promise<SearchParams>
}

export default async function RolesPage({ searchParams }: Props) {
  const params = await searchParams
  const search = params.search?.trim() || undefined

  const cookieStore = await cookies()
  const cookie = cookieStore.toString()

  const roleRepository = createRoleRepo({ cookie })
  const result = await roleRepository.search({
    skip: 0,
    take: PAGE_SIZE,
    search,
  })

  return (
    <div className="flex w-full flex-col gap-3">
      <RolesFilters search={search ?? ""} />
      <RolesTable
        key={randomUUID()}
        initialRoles={result.data}
        initialTotalRows={result.totalRows}
        search={search}
      />
    </div>
  )
}
