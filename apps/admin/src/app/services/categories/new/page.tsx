import { PageHeader } from "@repo/ui/components/admin/ui/page-header"
import { CategoryForm } from "@repo/ui/components/admin/services/category-form"

export default function NewCategoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Create Service Category" 
        description="Add a new category for your services."
      />
      <CategoryForm />
    </div>
  )
}

