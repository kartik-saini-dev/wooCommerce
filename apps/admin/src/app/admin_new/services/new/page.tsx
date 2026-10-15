import { prisma as db } from "@repo/db"
import { PageHeader } from "@repo/ui/components/admin/ui/page-header"
import { ServiceForm } from "@repo/ui/components/admin/services/service-form"

export default async function NewServicePage({
  searchParams
}: {
  searchParams: Promise<{ duplicate?: string }>
}) {
  const resolvedSearchParams = await searchParams
  let categories: any[] = []
  let duplicateData = null

  try {
    categories = await db.serviceCategory.findMany({
      select: { id: true, name: true }
    })

    if (resolvedSearchParams.duplicate) {
      duplicateData = await db.service.findUnique({
        where: { id: resolvedSearchParams.duplicate },
        include: { images: { orderBy: { sortOrder: 'asc' } } }
      })
    }
  } catch (error) {
    console.error("Failed to load data for new service:", error)
  }  
    if (duplicateData) {
      // Clear specific fields for duplication
      duplicateData.name = `Copy of ${duplicateData.name}`
      duplicateData.slug = `${duplicateData.slug}-copy`
    }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title={duplicateData ? "Duplicate Service" : "Create Service"}
        description="Add a new service offering to your platform."
      />
      <ServiceForm categories={categories} initialData={duplicateData} />
    </div>
  )
}

