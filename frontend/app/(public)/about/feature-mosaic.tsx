import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/date-utility"
import { cn } from '@/lib/utils'
import { CalendarPlus, Sparkles } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import { features } from "./features"

// Turns "Ver imagen: /file-upload.png" into a plain text + link fragment.
function renderDescription(text: string): ReactNode {
  const parts: ReactNode[] = []
  const pattern = /(Ver imagen:\s*)(\S+\.(?:png|jpe?g|gif|webp|svg))/gi
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    const path = match[2]
    parts.push(match[1])
    parts.push(
      <Link
        key={match.index}
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "text-primary underline underline-offset-2",
          "transition-opacity hover:opacity-80"
        )}
      >
        {path.replace(/^\//, "")}
      </Link>
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : text
}

export function FeatureMosaic() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {features.map((feature) => (
        <Card
          key={feature.id}
          className={cn(
            "group flex flex-col transition-all duration-300",
            "hover:border-primary/40 hover:shadow-md"
          )}
        >
          <CardContent className="flex flex-1 flex-col p-5">
            <div className="mb-4 flex items-start gap-4">
              <div className={cn(
                "shrink-0 rounded-xl bg-primary/10 p-2.5 transition-transform duration-300",
                "group-hover:scale-110"
              )}>
                <Sparkles className="size-5 text-primary" />
              </div>
              <div className="flex-1 text-[0.95rem] leading-relaxed text-foreground">
                <span className="mb-1 block font-semibold">
                  {feature.name}
                </span>
                {renderDescription(feature.description)}
              </div>
            </div>
            <div className={cn(
              "mt-auto flex items-center gap-2 border-t border-border/40",
              "pt-4 text-sm font-medium text-muted-foreground"
            )}>
              <CalendarPlus className="size-4 shrink-0" />
              <span className="truncate">
                {formatDate(feature.publishedAt)}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
