import { Title } from "@/components/common/title"
import { Card } from "@/components/ui/card"

// Placeholder for the mocked sidebar destinations that do not have
// a real page yet.
export default function PlaceholderPage() {
  return (
    <div className="w-full max-w-3xl py-6">
      <Title>Página en construcción</Title>
      <Card className="p-6">
        <p className="text-sm text-muted-foreground">
          Esta sección todavía no está disponible.
        </p>
      </Card>
    </div>
  )
}
