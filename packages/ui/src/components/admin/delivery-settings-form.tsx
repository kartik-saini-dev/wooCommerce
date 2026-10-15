"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card"
import { Label } from "@repo/ui/components/ui/label"
import { Input } from "@repo/ui/components/ui/input"
import { Button } from "@repo/ui/components/ui/button"
import { toast } from "sonner"
import { updateConfig } from "@repo/services/actions/config"
import { StoreConfiguration } from "@repo/services/services/config.service"

export function DeliverySettingsForm({ initialConfig }: { initialConfig: StoreConfiguration }) {
  const [config, setConfig] = React.useState<StoreConfiguration>(initialConfig)
  const [isSaving, setIsSaving] = React.useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    const result = await updateConfig(config)
    if (result.success) {
      toast.success("Settings updated successfully")
    } else {
      toast.error(result.error || "Failed to update settings")
    }
    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pickup Configuration</CardTitle>
          <CardDescription>Configure rules for store pickups.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Preparation Time (Hours)</Label>
              <Input 
                type="number" 
                value={config.PREPARATION_TIME_HOURS} 
                onChange={e => setConfig({...config, PREPARATION_TIME_HOURS: Number(e.target.value)})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Pickup Window (Hours)</Label>
              <Input 
                type="number" 
                value={config.PICKUP_WINDOW_HOURS} 
                onChange={e => setConfig({...config, PICKUP_WINDOW_HOURS: Number(e.target.value)})} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Fees</CardTitle>
          <CardDescription>Configure shipping costs and thresholds.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Base Delivery Fee (₹)</Label>
              <Input 
                type="number" 
                value={config.BASE_DELIVERY_FEE} 
                onChange={e => setConfig({...config, BASE_DELIVERY_FEE: Number(e.target.value)})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Free Delivery Threshold (₹)</Label>
              <Input 
                type="number" 
                value={config.FREE_DELIVERY_THRESHOLD} 
                onChange={e => setConfig({...config, FREE_DELIVERY_THRESHOLD: Number(e.target.value)})} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
          <CardDescription>Set active hours for pickup slots (24-hour format).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time (e.g., 9 for 9 AM)</Label>
              <Input 
                type="number" 
                min="0" max="23"
                value={config.BUSINESS_HOURS_START} 
                onChange={e => setConfig({...config, BUSINESS_HOURS_START: Number(e.target.value)})} 
              />
            </div>
            <div className="space-y-2">
              <Label>End Time (e.g., 18 for 6 PM)</Label>
              <Input 
                type="number" 
                min="1" max="24"
                value={config.BUSINESS_HOURS_END} 
                onChange={e => setConfig({...config, BUSINESS_HOURS_END: Number(e.target.value)})} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}
