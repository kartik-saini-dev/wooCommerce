"use client"

import { AlertCircle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen flex-col items-center justify-center gap-4 text-center px-4 bg-background">
          <AlertCircle className="h-16 w-16 text-destructive opacity-80" />
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Critical Error</h1>
            <p className="text-muted-foreground max-w-[500px]">
              A critical application error occurred. We are working to resolve this as quickly as possible.
            </p>
          </div>
          <button 
            onClick={() => reset()}
            aria-label="Try again to load the application"
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  )
}
