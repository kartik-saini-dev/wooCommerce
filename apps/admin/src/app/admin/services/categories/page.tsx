import Link from "next/link"
import { Plus } from "lucide-react"

import { prisma as db } from "@repo/db"
import { PageHeader } from "@repo/ui/components/admin/ui/page-header"
import { DataTable } from "@repo/ui/components/admin/ui/data-table"
import { columns } from "./columns"
import { getTranslation } from "@repo/services/i18n/server"

export const metadata = {
  title: "Service Categories | Admin",
}

export default async function CategoriesPage() {
  const { t } = await getTranslation()
  let data: any[] = []
  try {
    data = await db.serviceCategory.findMany({
      orderBy: { sortOrder: 'asc' }
    })
  } catch (error) {
    console.error("Failed to load service categories:", error)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title={t("admin.serviceCategories") || "Service Categories"} 
        description={t("admin.serviceCategoriesDesc") || "Manage your service categories and their ordering."}
      >
        <Link href="/admin/services/categories/new" className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/80 h-8 px-2.5">
          <Plus className="mr-2 h-4 w-4" />
          {t("admin.addCategory") || "Add Category"}
        </Link>
      </PageHeader>
      
      <DataTable columns={columns} data={data} searchKey="name" />
    </div>
  )
}

