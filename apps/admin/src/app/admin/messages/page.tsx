import { Metadata } from "next"
import { prisma as db } from "@repo/db"
import { DataTable } from "@repo/ui/components/admin/ui/data-table"
import { columns } from "./columns"

export const metadata: Metadata = {
  title: "Messages | Admin",
  description: "Manage customer contact messages",
}

export default async function MessagesPage() {
  let messages: any[] = []

  try {
    messages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("Failed to fetch messages:", error)
    // Application won't crash; the DataTable will just show an empty state safely.
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground mt-2">
          View and manage contact form submissions.
        </p>
      </div>
      <DataTable columns={columns} data={messages} searchKey="name" />
    </div>
  )
}

