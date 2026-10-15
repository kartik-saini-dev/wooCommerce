import { WifiOff } from "lucide-react"
import { Button } from "@repo/ui/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Offline | Electrical Store",
}

export default function OfflinePage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4 px-4 text-center">
      <div className="rounded-full bg-muted p-6">
        <WifiOff className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">You're offline</h1>
      <p className="max-w-[500px] text-muted-foreground">
        It looks like you've lost your internet connection. We couldn't load the requested page from our cache. Please check your connection and try again.
      </p>
      <div className="flex gap-4">
        {/* We can use window.location.reload() on client, but since this is an RSC, we'll use a link to home which might be cached */}
        <Link 
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          Go to Home
        </Link>
      </div>
    </div>
  )
}
