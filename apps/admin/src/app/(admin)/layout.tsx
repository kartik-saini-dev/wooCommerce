import * as React from "react"
import { AdminSidebar } from "@repo/ui/components/admin/layout/admin-sidebar"
import { AdminNavbar } from "@repo/ui/components/admin/layout/admin-navbar"
import { getServerSession } from "next-auth/next"
import { adminAuthOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(adminAuthOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AdminSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
        <AdminNavbar />
        <main className="flex-1 items-start p-4 sm:px-6 sm:py-0">
          {children}
        </main>
      </div>
    </div>
  )
}

