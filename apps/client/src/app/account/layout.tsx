import * as React from "react"
import { Container } from "@repo/ui/components/ui/container"
import { Section } from "@repo/ui/components/ui/section"
import { AccountSidebar } from "@repo/ui/components/account/account-sidebar"

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen pb-12">
      <div className="bg-primary/5 py-8 border-b">
        <Container>
          <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
        </Container>
      </div>

      <Section className="pt-8">
        <Container>
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-64 shrink-0">
              <AccountSidebar />
            </aside>

            <main className="flex-1 min-w-0">
              {children}
            </main>
          </div>
        </Container>
      </Section>
    </div>
  )
}
