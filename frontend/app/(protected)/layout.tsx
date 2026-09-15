import { Sidebar } from '@/components/layout/sidebar'
import { SidebarItem } from '@/components/layout/sidebar-item'
import { Topbar } from '@/components/layout/topbar'
import { getSession } from '@/lib/auth'
import { menuRepository } from '@/repositories/menu-repository'
import { redirect } from 'next/navigation'
import { type ReactNode } from "react"

interface Props {
  children: ReactNode
}

export default async function ProtectedLayout({ children }: Props) {
  const userInfo = await getSession()
  if (!userInfo)  redirect("/login")

  const items = await menuRepository.listByRole(userInfo.roleName)

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-dots pointer-events-none" />
      <Sidebar userSession={userInfo}>
        {
          items.map(item =>
            <SidebarItem
                key={item.id}
                iconName={item.iconName}
                text={item.text}
                alert={item.alert}
                to={item.path}
            />
          )
        }
      </Sidebar>

      <div className="flex">
        <Topbar userSession={userInfo} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
