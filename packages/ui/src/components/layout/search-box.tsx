"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@repo/ui/components/ui/input"
import { cn } from "@repo/services/utils"

export function SearchBox({ className, onSearch }: { className?: string, onSearch?: () => void }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = React.useState(searchParams.get("q") || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      if (onSearch) onSearch()
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative flex items-center w-full", className)}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search parts, services..."
        className="w-full bg-muted/50 dark:bg-muted/20 focus-visible:bg-background shadow-none pl-8 transition-colors"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  )
}
