import { PageHeader } from "@repo/ui/components/admin/ui/page-header"
import { CategoryForm } from "@repo/ui/components/admin/services/category-form"
import { getTranslation } from "@repo/services/i18n/server"

export default async function NewCategoryPage() {
  const { t } = await getTranslation()
  
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title={t("admin.createServiceCategory") || "Create Service Category"} 
        description={t("admin.createServiceCategoryDesc") || "Add a new category for your services."}
      />
      <CategoryForm />
    </div>
  )
}

