import { ThemeToggle } from "@/components/common/theme-toggle"
import { ProfileMenu } from "@/components/layout/profile-menu"
import { cn } from "@/lib/utils"
import { type UserInfoModel } from '@/models/user-info-model'
import { User } from "lucide-react"

interface Props {
  userSession: UserInfoModel
}

export function Topbar({ userSession }: Props) {
  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 glass-header",
        "p-2 flex justify-between items-center"
      )}
    >
      <nav className="flex-1" />
      <nav className="flex-none flex justify-end gap-1">
        <ThemeToggle />
        <ProfileMenu userSession={userSession}>
          <span 
            aria-label="Perfil"
            className={cn(
              "size-10 min-w-10 rounded-full cursor-pointer",
              "flex items-center justify-center text-primary",
              "transition-colors hover:bg-primary/10"
            )}
          >
            <User size={20} />
          </span>
        </ProfileMenu>
      </nav>
    </div>
  )
}
