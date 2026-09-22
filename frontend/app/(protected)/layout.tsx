import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { AuthPermissionsSync } from "@/components/common/auth-permissions-sync"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Separator } from "@/components/ui/separator"
import { buildPermissionTree } from '@/lib/permission-tree'
import { cn } from '@/lib/utils'
import { UserInfoModel } from '@/models/user-info-model'
import { createPermissionRepo } from '@/repositories/permission-repository'
import { createUserRepo } from '@/repositories/user-repository'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { type ReactNode } from "react"

interface Props {
  children: ReactNode
}

export default async function ProtectedLayout({ children }: Props) {
  let userInfo: UserInfoModel | undefined = undefined
  const cookieStore = await cookies()
  const userRepository = createUserRepo({ cookie: cookieStore.toString() })

  try {
    userInfo = await userRepository.refreshToken()
    if (!userInfo) throw new Error("User not found")
  } catch {
    redirect("/login")
  }

  // Reuse the cookie refreshed above so protected calls do not refresh again.
  const permRepository = createPermissionRepo({ cookie: userRepository.cookie })
  const permissions = await permRepository.listByRole(userInfo.roleId)

  const menuItems = buildPermissionTree(
    permissions.filter(per => per.type === "MENU" && per.active))

  return (
    <SidebarProvider>
      <AuthPermissionsSync permissions={permissions} />
      <AppSidebar userInfo={userInfo} menuItems={menuItems} />
      <SidebarInset className="overflow-hidden">
        <header className={cn(
          "flex h-14 shrink-0 items-center gap-2 border-b",
          "border-dashed border-border/70 bg-background"
        )}>
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumbs items={permissions} />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 bg-content p-3 md:p-5">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
