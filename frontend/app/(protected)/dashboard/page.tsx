import { Title } from "@/components/common/title"
import { Card } from "@/components/ui/card"
import { createUserRepo } from '@/repositories/user-repository'
import { cookies } from 'next/headers'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const userRepository = createUserRepo({ cookie: cookieStore.toString() })
  const userInfo = await userRepository.refreshToken()

  return (
    <div className="w-full max-w-3xl py-6">
      <Title>¡Hola, {userInfo?.firstName}!</Title>
      <Card className="p-6">
        <p className="text-sm text-muted-foreground">
          Has iniciado sesión correctamente como{" "}
          <span className="font-semibold text-foreground">
            {userInfo?.email}
          </span>
          .
        </p>
        {
          userInfo?.roleName &&
          <p className="mt-2 text-xs text-muted-foreground">
            Rol: {userInfo.roleName}
          </p>
        }
      </Card>
    </div>
  )
}
