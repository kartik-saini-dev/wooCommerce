import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import { PageHeader } from "@repo/ui/components/admin/ui/page-header"
import { DataTable } from "@repo/ui/components/admin/ui/data-table"
import { columns, ProductColumnData } from "./columns"
import { ProductRepository } from "@repo/services/repositories/product"

export const dynamic = "force-dynamic"

export default async function ProductsPage() {
  let items: any[] = []
  try {
    const result = await ProductRepository.findAll({ limit: 100 }) // In production, add real pagination
    items = result.items
  } catch (error) {
    console.error("Failed to load admin products:", error)
  }

  const data: ProductColumnData[] = items.map(product => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    price: Number(product.price),
    isActive: product.isActive,
    stock: product.inventory?.quantity || 0,
    imageUrl: product.images?.[0]?.url,
    category: product.category?.name || 'N/A',
  }))

  return (
    <div className="flex-1 space-y-4">
      <PageHeader 
        title="Products" 
        description="Manage your store's products."
      >
        <Link href="/admin/products/new" className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/80 h-8 px-2.5">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Link>
      </PageHeader>
      
      <DataTable columns={columns} data={data} searchKey="name" />
    </div>
  )
}

