"use client"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import { PermissionTreeModel } from "@/models/permission-model"
import { cn } from 'cn'
import * as Icon from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

// Icons travel from the backend as names (e.g. "BarChart3").
function PermissionIcon({ name }: { name: string | null }) {
  const IconComponent = name
    ? (Icon[name as keyof typeof Icon] as Icon.LucideIcon | undefined)
    : undefined
  const Component = IconComponent ?? Icon.LayoutGrid
  return <Component />
}

function isPathActive(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`)
}

// A branch is active when it or any descendant matches the current path.
function isBranchActive(pathname: string, node: PermissionTreeModel): boolean {
  return (
    isPathActive(pathname, node.path) ||
    node.children.some(child => isBranchActive(pathname, child))
  )
}

interface NavItemProps {
  item: PermissionTreeModel
  pathname: string
  depth?: number
}

function NavItem({ item, pathname, depth = 0 }: NavItemProps) {
  const isRoot = depth === 0
  const active = isBranchActive(pathname, item)
  const [open, setOpen] = useState(active)

  useEffect(() => {
    if (active) setOpen(true)
  }, [active])

  if (item.children.length === 0) {
    const content = (
      <>
        <PermissionIcon name={item.icon} />
        <span>{item.title}</span>
      </>
    )

    if (isRoot) {
      return (
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={active}
            render={<Link href={item.path} />}
          >
            {content}
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    }

    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton 
          isActive={active} 
          render={<Link href={item.path} />}
        >
          {content}
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    )
  }

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="group/collapsible"
      render={isRoot ? <SidebarMenuItem /> : <SidebarMenuSubItem />}
    >
      <CollapsibleTrigger render={
        <SidebarMenuButton 
          tooltip={item.title} 
          isActive={active} 
        />
      }>
        <PermissionIcon name={item.icon} />
        <span>{item.title}</span>
        <Icon.ChevronRight className={cn(
          "ml-auto transition-transform duration-200",
          "group-data-open/collapsible:rotate-90"
        )} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {item.children.map(child => (
            <NavItem
              key={child.id}
              item={child}
              pathname={pathname}
              depth={depth + 1}
            />
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}


interface Props {
  items: PermissionTreeModel[]
}

export function NavMain({ items }: Props) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Accesos</SidebarGroupLabel>
      <SidebarMenu>
        {items.map(item => (
          <NavItem key={item.id} item={item} pathname={pathname} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
