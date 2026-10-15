import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

import { cn } from "@repo/services/utils"

interface BreadcrumbItem {
  title: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm text-muted-foreground", className)}>
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="hover:text-foreground transition-colors flex items-center">
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            {item.href ? (
              <Link href={item.href} className="hover:text-foreground transition-colors">
                {item.title}
              </Link>
            ) : (
              <span className="text-foreground font-medium" aria-current="page">
                {item.title}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
