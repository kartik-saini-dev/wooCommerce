import { notFound } from "next/navigation"
import { prisma as db } from "@repo/db"
import { PageHeader } from "@repo/ui/components/admin/ui/page-header"
import { CategoryForm } from "@repo/ui/components/admin/products/category-form"

interface EditCategoryPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductCategoryPage({ params }: EditCategoryPageProps) {
  const resolvedParams = await params
  const category = await db.category.findUnique({
    where: { id: resolvedParams.id }
  })

  if (!category) {
    notFound()
  }

  const categories = await db.category.findMany({
    orderBy: { sortOrder: 'asc' }
  })

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title={`Edit Category: ${category.name}`}
        description="Modify the details of this product category."
      />
      <CategoryForm categories={categories} initialData={category} />
    </div>
  )
}
