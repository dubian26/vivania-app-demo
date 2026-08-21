import { FeatureCard } from "@/components/common/feature-card"
import { cn } from "@/lib/utils"
import { KeyRound, ScanSearch, UserCog } from "lucide-react"

export function LoginFeatures() {
  return (
    <div className={cn(
      "flex max-w-xl flex-1 animate-in flex-col gap-4 duration-500",
      "fade-in slide-in-from-right-5 fill-mode-backwards motion-reduce:animate-none"
    )}>
      <div className="mb-3">
        <h2 className="mt-3 text-3xl leading-tight font-extrabold lg:text-4xl">
          Demo Vivania App
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Proyecto demo creado para mostrar el desarrollo de algunas
          características de seguridad, gestión de contenido y optimización de
          una aplicación web moderna.
        </p>
      </div>

      <div className="grid gap-3">
        <FeatureCard
          icon={<KeyRound className="text-primary" size={24} />}
          title="Autenticación moderna"
        >
          Incluye Silent Refresh con JWT, validación OTP (One-Time Password)
          y acceso con Google OAuth2.
        </FeatureCard>
        <FeatureCard
          icon={<UserCog className="text-primary" size={24} />}
          title="Gestión y administración"
        >
          También incorpora Rol Manager y File Upload 
          para demostrar flujos comunes de administración interna.
        </FeatureCard>
        <FeatureCard
          icon={<ScanSearch className="text-primary" size={24} />}
          title="Escalabilidad en frontend"
        >
          Se complementa con Infinity Scroll y React Virtualization 
          para manejar listados extensos con mejor rendimiento.
        </FeatureCard>
      </div>
    </div>
  )
}
