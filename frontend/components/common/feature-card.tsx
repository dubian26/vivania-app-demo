import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { type ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  children: ReactNode
}

export function FeatureCard({ icon, title, children }: FeatureCardProps) {
  return (
    <Card className="group transition-all duration-300 hover:border-primary/30">
      <CardContent className="p-6">
        <div className="flex items-start gap-5">
          <div className={cn(
              "rounded-xl bg-primary/10 p-3",
              "transition-transform duration-300 group-hover:scale-110"
            )}
          >
            {icon}
          </div>
          <div>
            <h3 className="mb-1 text-lg font-bold text-foreground">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {children}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
