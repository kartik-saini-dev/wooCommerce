import { prisma as db } from "@repo/db"
import { PageHeader } from "@repo/ui/components/admin/ui/page-header"
import { CategoryForm } from "@repo/ui/components/admin/products/category-form"

export default async function NewProductCategoryPage() {
  const categories = await db.category.findMany({
    orderBy: { sortOrder: 'asc' }
  })

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Create Product Category" 
        description="Add a new category for your products."
      />
      <CategoryForm categories={categories} />
    </div>
  )
}

