import { Title } from "@/components/common/title"
import type { Metadata } from "next"
import { FeatureMosaic } from "./feature-mosaic"

export const metadata: Metadata = {
  title: "Acerca de | Vivania",
  description: "Funcionalidades y tecnologías desarrolladas en Vivania App.",
}

export default function AboutPage() {
  return (
    <div className="w-full max-w-7xl">
      <Title>Acerca de</Title>
      <p className="mb-6 text-lg text-muted-foreground">
        Esta aplicación es una{" "}
        <strong className="font-semibold text-foreground">demostración</strong>{" "}
        de un sistema de inventario para tiendas virtuales. A continuación se
        muestran las funcionalidades y tecnologías desarrolladas en esta
        aplicación:
      </p>
      <FeatureMosaic />
    </div>
  )
}
