import { notFound } from "next/navigation"
import { PageHeader } from "@repo/ui/components/admin/ui/page-header"
import { ProductForm } from "@repo/ui/components/admin/products/product-form"
import { ProductRepository } from "@repo/services/repositories/product"
import { prisma } from "@repo/db"

export const dynamic = "force-dynamic"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const product = await ProductRepository.findById(resolvedParams.id)
  
  if (!product) {
    notFound()
  }

  // Fetch dependencies for the form
  const categories = await prisma.category.findMany({ select: { id: true, name: true } })
  const brands = await prisma.brand.findMany({ select: { id: true, name: true } })

  return (
    <div className="flex-1 space-y-4 max-w-5xl mx-auto">
      <PageHeader 
        title="Edit Product" 
        description={`Make changes to ${product.name}.`}
      />
      
      <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
        <ProductForm 
          initialData={{
            ...product,
            price: Number(product.price),
            comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
            discount: product.discount ? Number(product.discount) : null
          }} 
          categories={categories} 
          brands={brands} 
        />
      </div>
    </div>
  )
}
