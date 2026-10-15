"use client"

import { signOut } from "next-auth/react"
import { ShieldAlert } from "lucide-react"

export function AdminSwitchButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      aria-label="Sign out and switch to admin login"
      className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border bg-background text-foreground hover:bg-muted h-9 px-4 text-sm font-medium transition-all outline-none select-none"
    >
      <ShieldAlert className="mr-2 h-4 w-4" />
      Sign Out & Switch to Admin
    </button>
  )
}
