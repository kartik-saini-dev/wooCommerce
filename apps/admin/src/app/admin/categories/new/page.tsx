import { prisma as db } from "@repo/db"
import { PageHeader } from "@repo/ui/components/admin/ui/page-header"
import { CategoryForm } from "@repo/ui/components/admin/products/category-form"

import { getTranslation } from "@repo/services/i18n/server"

export default async function NewProductCategoryPage() {
  const { t } = await getTranslation()
  const categories = await db.category.findMany({
    orderBy: { sortOrder: 'asc' }
  })

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title={t("admin.createProductCategory") || "Create Product Category"} 
        description={t("admin.createProductCategoryDesc") || "Add a new category for your products."}
      />
      <CategoryForm categories={categories} />
    </div>
  )
}

