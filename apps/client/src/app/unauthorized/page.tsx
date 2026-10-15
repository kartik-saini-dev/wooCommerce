import Link from "next/link"
import { ShieldAlert, Home } from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import { Container } from "@repo/ui/components/ui/container"
import { Section } from "@repo/ui/components/ui/section"
import { AdminSwitchButton } from "@repo/ui/components/auth/admin-switch-button"

export default function UnauthorizedPage() {
  return (
    <Section className="flex-1 flex items-center justify-center py-20">
      <Container className="max-w-md text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10 mb-8">
          <ShieldAlert className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-destructive">
          403 Forbidden
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          You do not have permission to access this page. This area is restricted to authorized roles only.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none bg-primary text-primary-foreground hover:bg-primary/80 h-9 px-4">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <AdminSwitchButton />
        </div>
      </Container>
    </Section>
  )
}
