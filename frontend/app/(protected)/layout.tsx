import { Sidebar } from '@/components/layout/sidebar'
import { SidebarItem } from '@/components/layout/sidebar-item'
import { Topbar } from '@/components/layout/topbar'
import { UserInfoModel } from '@/models/user-info-model'
import { createPermissionRepo } from '@/repositories/permission-repository'
import { createUserRepo } from '@/repositories/user-repository'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { type ReactNode } from "react"

const DEFAULT_ICON = "LayoutGrid"

interface Props {
  children: ReactNode
}

export default async function ProtectedLayout({ children }: Props) {
  let userInfo: UserInfoModel | undefined = undefined
  const cookieStore = await cookies()

  try {
    const userRepository = createUserRepo({ cookie: cookieStore.toString() })
    userInfo = await userRepository.refreshToken()
    if (!userInfo) throw new Error("User not found")
  } catch {
    redirect("/login")
  }

  const permRepository = createPermissionRepo({ cookie: cookieStore.toString() })
  const permissions = await permRepository.listByRole(userInfo.roleId)

  const items =  permissions
    .filter(per => per.type === "MENU" && per.active)
    .sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen flex">
      <div className="fixed inset-0 -z-10 bg-dots pointer-events-none" />
      <Sidebar userSession={userInfo}>
        {
          items.map(item =>
            <SidebarItem
                key={item.id}
                iconName={item.icon ?? DEFAULT_ICON}
                text={item.title}
                alert={false}
                to={item.path}
            />
          )
        }
      </Sidebar>

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar userSession={userInfo} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
