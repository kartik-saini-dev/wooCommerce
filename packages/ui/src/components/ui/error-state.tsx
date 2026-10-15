import { AlertTriangle } from "lucide-react"
import { cn } from "@repo/services/utils"
import { Button } from "./button"

export interface ErrorStateProps {
  title?: string
  description?: string
  retry?: () => void
  className?: string
}

export function ErrorState({
  title = "Something went wrong",
  description = "An error occurred while loading this content. Please try again.",
  retry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center animate-in fade-in-50",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-destructive">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        {description}
      </p>
      {retry && (
        <Button variant="outline" onClick={retry} className="mt-6">
          Try Again
        </Button>
      )}
    </div>
  )
}
