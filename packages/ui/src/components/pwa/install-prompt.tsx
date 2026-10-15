"use client"

import { usePwaInstall } from "@repo/ui/hooks/use-pwa-install"
import { Button } from "@repo/ui/components/ui/button"
import { Download } from "lucide-react"

export function InstallPrompt() {
  const { isInstallable, isInstalled, isStandalone, promptInstall } = usePwaInstall()

  // Do not render anything if the app is already installed or cannot be installed
  if (isInstalled || isStandalone || !isInstallable) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:w-80">
      <div className="flex flex-col gap-3 rounded-lg border bg-background p-4 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold leading-none tracking-tight">Install App</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add to your home screen for a faster, offline-capable experience.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={promptInstall} className="w-full flex items-center gap-2">
            <Download className="h-4 w-4" />
            Install Now
          </Button>
        </div>
      </div>
    </div>
  )
}
