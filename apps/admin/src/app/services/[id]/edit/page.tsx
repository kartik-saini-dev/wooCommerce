import { notFound } from "next/navigation"
import { prisma as db } from "@repo/db"
import { PageHeader } from "@repo/ui/components/admin/ui/page-header"
import { ServiceForm } from "@repo/ui/components/admin/services/service-form"

interface EditServicePageProps {
  params: Promise<{ id: string }>
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const resolvedParams = await params
  let service = null
  let categories: any[] = []
  
  try {
    service = await db.service.findUnique({
      where: { id: resolvedParams.id },
      include: { images: { orderBy: { sortOrder: 'asc' } } }
    })
    categories = await db.serviceCategory.findMany({
      select: { id: true, name: true }
    })
  } catch (error) {
    console.error("Failed to fetch service edit data:", error)
  }

  if (!service) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title={`Edit Service: ${service.name}`}
        description="Modify the details of this service."
      />
      <ServiceForm categories={categories} initialData={service} />
    </div>
  )
}
