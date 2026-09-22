"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

import { Title } from "@/components/common/title"
import { cn } from '@/lib/utils'
import { PermissionTreeModel } from "@/models/permission-model"
import { UserInfoModel } from "@/models/user-info-model"
import { BuildingComplexIcon } from "lucide-react"
import Link from 'next/link'
import { ComponentProps } from "react"
import { NavFavorites } from "./nav-favorites"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"

interface Props extends ComponentProps<typeof Sidebar> {
  userInfo: UserInfoModel
  menuItems: PermissionTreeModel[]
}

export function AppSidebar({ userInfo, menuItems, ...props }: Props) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Vivania"
              render={<Link href="/dashboard" />}
              className="gap-3 focus-visible:bg-sidebar-accent"
            >
              <BuildingComplexIcon
                strokeWidth={2}
                className="size-8! text-primary"
              />
              <div className="grid min-w-0 flex-1 text-left leading-tight">
                <Title
                  as="span" translate="no"
                  className={cn(
                    "mb-0 max-w-full truncate text-lg",
                    "leading-none tracking-tight md:text-lg"
                  )}
                >
                  Vivania
                </Title>
                <span className={cn(
                  "truncate text-[11px] font-medium",
                  "tracking-wide text-muted-foreground"
                )}>
                  Gestión de Condominios
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuItems} />
        <NavFavorites favorites={[]} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userInfo} />
      </SidebarFooter>
    </Sidebar>
  )
}
