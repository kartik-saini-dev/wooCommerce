"use client"

import { useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@repo/ui/components/ui/button"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error)
  }, [error])

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center gap-4 text-center px-4">
      <AlertCircle className="h-16 w-16 text-destructive opacity-80" />
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Something went wrong!</h1>
        <p className="text-muted-foreground max-w-[500px]">
          We apologize, but an unexpected error has occurred. Our team has been notified. 
          Please try again or contact support if the problem persists.
        </p>
      </div>
      <div className="flex gap-4 mt-4">
        <Button onClick={() => reset()} variant="default">
          Try Again
        </Button>
        <Button onClick={() => window.location.href = '/'} variant="outline">
          Return Home
        </Button>
      </div>
    </div>
  )
}
