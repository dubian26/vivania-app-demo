import { Geist_Mono, Inter } from "next/font/google"

import { ThemeProvider } from "@/components/common/theme-provider"
import { GoogleProvider } from "@/contexts/google-provider"
import { AppProvider } from "@/contexts/app-provider"
import { cn } from "@/lib/utils"
import "./globals.css"

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
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
