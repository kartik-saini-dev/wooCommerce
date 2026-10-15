import { PageHeader } from "@repo/ui/components/admin/ui/page-header"
import { ProductForm } from "@repo/ui/components/admin/products/product-form"
import { prisma } from "@repo/db"

export const dynamic = "force-dynamic"

export default async function NewProductPage() {
  // Fetch dependencies for the form
  const categories = await prisma.category.findMany({ select: { id: true, name: true } })
  const brands = await prisma.brand.findMany({ select: { id: true, name: true } })

  return (
    <div className="flex-1 space-y-4 max-w-5xl mx-auto">
      <PageHeader 
        title="Add Product" 
        description="Create a new product for your store."
      />
      
      <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
        <ProductForm categories={categories} brands={brands} />
      </div>
    </div>
  )
}

