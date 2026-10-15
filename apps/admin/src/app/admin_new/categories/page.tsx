import Link from "next/link"
import { Plus } from "lucide-react"

import { prisma as db } from "@repo/db"
import { PageHeader } from "@repo/ui/components/admin/ui/page-header"
import { DataTable } from "@repo/ui/components/admin/ui/data-table"
import { columns } from "./columns"

export const metadata = {
  title: "Product Categories | Admin",
}

export default async function ProductCategoriesPage() {
  let data: any[] = []
  try {
    data = await db.category.findMany({
      orderBy: { sortOrder: 'asc' }
    })
  } catch (error) {
    console.error("Failed to load product categories:", error)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Product Categories" 
        description="Manage your product categories and sub-categories."
      >
        <Link href="/admin/categories/new" className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/80 h-8 px-2.5">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Link>
      </PageHeader>
      
      <DataTable columns={columns} data={data} searchKey="name" />
    </div>
  )
}

