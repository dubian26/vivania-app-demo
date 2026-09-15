import { ThemeProvider } from "@/components/common/theme-provider"
import { AppProvider } from "@/contexts/app-provider"
import { GoogleProvider } from "@/contexts/google-provider"
import { cn } from "@/lib/utils"
import { Geist_Mono, Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({subsets:['latin'], variable:'--font-sans'})
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono"})

interface Props {
  children: React.ReactNode
}

export default function RootLayout({children}: Readonly<Props>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <ThemeProvider>
          <GoogleProvider>
            <AppProvider>{children}</AppProvider>
          </GoogleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
