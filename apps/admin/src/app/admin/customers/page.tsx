import { PageHeader } from "@repo/ui/components/admin/ui/page-header"

export const dynamic = "force-dynamic"

export default function CustomersPage() {
  return (
    <div className="flex-1 space-y-4">
      <PageHeader 
        title="Customers" 
        description="Manage your customers and user accounts."
      />
      <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl bg-card border-dashed">
        <h3 className="text-xl font-bold mb-2">Customers Module</h3>
        <p className="text-muted-foreground">The customers module is currently under construction.</p>
      </div>
    </div>
  )
}
