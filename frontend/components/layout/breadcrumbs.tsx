"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import type { PermissionModel } from "@/models/permission-model"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

interface Props {
  items: PermissionModel[]
}

interface Crumb {
  id?: string
  path: string
  title: string
}

export function Breadcrumbs({ items }: Props) {
  const pathname = usePathname()

  const byId = new Map(items.map((item) => [item.id, item]))

  const current =
    items.find((item) => item.path === pathname) ??
    items
      .filter(
        (item) => item.path !== "/" && pathname.startsWith(`${item.path}/`)
      )
      .sort((a, b) => b.path.length - a.path.length)[0]

  const trail: PermissionModel[] = []
  let node: PermissionModel | undefined = current
  while (node) {
    trail.unshift(node)
    node = node.parentId ? byId.get(node.parentId) : undefined
  }

  const crumbs: Crumb[] =
    trail.length > 0 ? trail : [{ path: pathname, title: fallbackTitle(pathname) }]

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1
          const isGroup = items.some((item) => item.parentId === crumb.id)
          return (
            <Fragment key={crumb.path}>
              {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
              <BreadcrumbItem
                className={
                  index === 0 && crumbs.length > 1 ? "hidden md:block" : undefined
                }
              >
                {isLast ? (
                  <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                ) : isGroup ? (
                  <span className="text-muted-foreground">{crumb.title}</span>
                ) : (
                  <BreadcrumbLink render={<Link href={crumb.path} />}>
                    {crumb.title}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function fallbackTitle(pathname: string) {
  const segment = pathname.split("/").filter(Boolean).pop()
  if (!segment) return "Inicio"
  return segment.charAt(0).toUpperCase() + segment.slice(1)
}
