import { UserFilters } from "@/components/usuarios/user-filters"
import { UserTable } from "@/components/usuarios/user-table"
import type { SearchParams } from "@/models/search-model"
import { createUserRepo } from "@/repositories/user-repository"
import { cookies } from "next/headers"
import { randomUUID } from "node:crypto"

const PAGE_SIZE = 10

interface Props {
  searchParams: Promise<SearchParams>
}

export default async function UsuariosPage({ searchParams }: Props) {
  const params = await searchParams
  const search = params.search?.trim() || undefined

  const cookieStore = await cookies()
  const cookie = cookieStore.toString()

  const userRepository = createUserRepo({ cookie })

  const result = await userRepository.search({
    skip: 0,
    take: PAGE_SIZE,
    search,
  })

  return (
    <div className="flex w-full flex-col gap-3">
      <UserFilters search={search ?? ""} />
      <UserTable
        key={randomUUID()}
        initialUsers={result.data}
        initialTotalRows={result.totalRows}
        search={search}
      />
    </div>
  )
}
