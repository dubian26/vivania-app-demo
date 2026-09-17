import { AppSidebar } from "@/components/nav-layout/app-sidebar"
import { Separator } from "@/components/ui/separator"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

import { buildPermissionTree } from '@/lib/permission-tree'
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

  try {
    const userRepository = createUserRepo({ cookie: cookieStore.toString() })
    userInfo = await userRepository.refreshToken()
    if (!userInfo) throw new Error("User not found")
  } catch {
    redirect("/login")
  }

  const permRepository = createPermissionRepo({ cookie: cookieStore.toString() })
  const permissions = await permRepository.listByRole(userInfo.roleId)

  const menuItems = buildPermissionTree(
    permissions.filter(per => per.type === "MENU" && per.active))

  return (
    <SidebarProvider>
      <AppSidebar
        userInfo={userInfo}
        menuItems={menuItems}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Build Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
