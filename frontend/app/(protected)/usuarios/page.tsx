import { Title } from "@/components/common/title"
import { UserFilters } from "@/components/usuarios/user-filters"
import { UserTable } from "@/components/usuarios/user-table"
import type { SearchParams } from "@/models/search-model"
import { createUserRepo } from "@/repositories/user-repository"
import { cookies } from "next/headers"

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

  // PAGE_SIZE + 1 detects whether there is a next page without a count query.
  const users = await userRepository.search({
    skip: 0,
    take: PAGE_SIZE + 1,
    search,
  })

  return (
    <div className="flex w-full flex-col gap-3">
      <Title>Usuarios</Title>
      <UserFilters search={search ?? ""} />
      <UserTable
        key={search ?? "default"}
        initialUsers={users.slice(0, PAGE_SIZE)}
        initialHasMore={users.length > PAGE_SIZE}
        search={search}
      />
    </div>
  )
}
