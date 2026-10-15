import { ConfigService } from "@repo/services/services/config.service"
import { DeliverySettingsForm } from "@repo/ui/components/admin/delivery-settings-form"

export const metadata = {
  title: "Delivery Settings | Admin",
}

export default async function AdminDeliverySettingsPage() {
  const config = await ConfigService.getConfig()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Delivery & Pickup Rules</h2>
      </div>
      
      <DeliverySettingsForm initialConfig={config} />
    </div>
  )
}

