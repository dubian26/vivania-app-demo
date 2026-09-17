"use client"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

import {
    BadgeCheckIcon,
    BellIcon,
    ChevronsUpDownIcon,
    CreditCardIcon,
    LogOutIcon,
    MoonIcon,
    SunIcon
} from "lucide-react"

import { useTheme } from "next-themes"

import { useAsync } from "@/hooks/use-async"
import { UserInfoModel } from "@/models/user-info-model"
import { createUserRepo } from "@/repositories/user-repository"

const userRepository = createUserRepo()

interface Props {
  user: UserInfoModel
}

export function NavUser({ user }: Props) {
  const { isMobile } = useSidebar()
  const { run, loading } = useAsync()
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const fullName = `${user.firstName} ${user.lastName}`
  const avatarIniciales = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`

  const handleToggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  const handleLogout = async () => {
    const loggedOut = await run(userRepository.logout().then(() => true))
    if (loggedOut) window.location.replace("/login")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <Avatar>
              <AvatarImage src={avatarIniciales} alt={fullName} />
              <AvatarFallback>{avatarIniciales}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{fullName}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar>
                    <AvatarImage src={avatarIniciales} alt={fullName} />
                    <AvatarFallback>{avatarIniciales}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{fullName}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheckIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleToggleTheme}>
              {isDark ? <SunIcon /> : <MoonIcon />}
              {isDark ? "Modo claro" : "Modo oscuro"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              disabled={loading}
              onClick={handleLogout}
            >
              <LogOutIcon />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
