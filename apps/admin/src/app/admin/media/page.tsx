import { PageHeader } from "@repo/ui/components/admin/ui/page-header"

export const dynamic = "force-dynamic"

export default function MediaLibraryPage() {
  return (
    <div className="flex-1 space-y-4">
      <PageHeader 
        title="Media Library" 
        description="Manage your store's images and media assets."
      />
      <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl bg-card border-dashed">
        <h3 className="text-xl font-bold mb-2">Media Library</h3>
        <p className="text-muted-foreground">The media library is currently under construction.</p>
      </div>
    </div>
  )
}
