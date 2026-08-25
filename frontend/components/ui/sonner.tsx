"use client"

import { CircleCheckIcon, CircleXIcon, InfoIcon, Loader2Icon, TriangleAlertIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

export const Toaster = ({ ...props }: ToasterProps) => {
   const { theme = "system" } = useTheme()

   return (
      <Sonner
         theme={theme as ToasterProps["theme"]}
         className="toaster group"
         icons={{
            success: <CircleCheckIcon className="size-8! text-emerald-500 dark:text-emerald-400" />,
            info: <InfoIcon className="size-8! text-blue-500 dark:text-blue-400" />,
            warning: <TriangleAlertIcon className="size-8! text-amber-500 dark:text-amber-400" />,
            error: <CircleXIcon className="size-8! text-red-500 dark:text-red-400" />,
            loading: <Loader2Icon className="size-8! animate-spin text-primary" />,
         }}
         toastOptions={{
            classNames: {
               toast: "items-start! gap-3! border-l-5! shadow-lg! py-3! px-4!",
               title: "font-semibold! text-md!",
               description: "text-md! text-muted-foreground!",
               icon: "mt-1! w-8! h-8!",
            },
         }}
         {...props}
      />
   )
}
