"use client"

import * as React from "react"
import { Card, CardContent } from "@repo/ui/components/ui/card"
import { MapPin, Truck, CheckCircle2, Loader2, AlertCircle } from "lucide-react"

export function LiveTracker({ 
  orderId, 
  status, 
  deliveryMethod 
}: { 
  orderId: string, 
  status: string,
  deliveryMethod: string
}) {
  const [driverLocation, setDriverLocation] = React.useState<{lat: number, lng: number} | null>(null)
  const [trackingStatus, setTrackingStatus] = React.useState<"checking" | "waiting" | "tracking" | "error" | "delivered">("checking")
  
  React.useEffect(() => {
    if (deliveryMethod !== "HOME_DELIVERY") {
      setTrackingStatus("error")
      return
    }

    if (status === "DELIVERED") {
      setTrackingStatus("delivered")
      return
    }

    if (status !== "OUT_FOR_DELIVERY") {
      setTrackingStatus("waiting")
      return
    }

    const pollLocation = async () => {
      try {
        const res = await fetch(`/api/driver/location?orderId=${orderId}`)
        const data = await res.json()

        if (data.status === "tracking" && data.location) {
          setDriverLocation(data.location)
          setTrackingStatus("tracking")
        } else if (data.status === "waiting_for_driver") {
          setTrackingStatus("waiting")
        } else {
          setTrackingStatus("error")
        }
      } catch (e) {
        setTrackingStatus("error")
      }
    }

    pollLocation()
    const interval = setInterval(pollLocation, 10000)
    return () => clearInterval(interval)
  }, [orderId, status, deliveryMethod])

  if (deliveryMethod !== "HOME_DELIVERY") {
    return (
      <Card>
        <CardContent className="p-12 text-center flex flex-col items-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">Tracking Unavailable</h3>
          <p className="text-muted-foreground mt-2">Live tracking is only available for home delivery orders.</p>
        </CardContent>
      </Card>
    )
  }

  if (trackingStatus === "checking") {
    return (
      <Card>
        <CardContent className="p-12 text-center flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <h3 className="text-xl font-semibold">Connecting to Driver...</h3>
        </CardContent>
      </Card>
    )
  }

  if (trackingStatus === "delivered") {
    return (
      <Card>
        <CardContent className="p-12 text-center flex flex-col items-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-xl font-semibold">Order Delivered</h3>
          <p className="text-muted-foreground mt-2">Your order has been successfully delivered. Thank you!</p>
        </CardContent>
      </Card>
    )
  }

  if (trackingStatus === "waiting") {
    return (
      <Card>
        <CardContent className="p-12 text-center flex flex-col items-center">
          <Truck className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">Waiting for Driver</h3>
          <p className="text-muted-foreground mt-2">
            {status === "OUT_FOR_DELIVERY" 
              ? "Driver is assigned but hasn't started sharing location yet." 
              : "Live tracking will be available once the order is Out for Delivery."}
          </p>
        </CardContent>
      </Card>
    )
  }

  const hasMapKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  
  return (
    <Card className="overflow-hidden">
      {/* Live Map Area */}
      <div className="w-full h-[60vh] bg-muted flex items-center justify-center relative">
        {hasMapKey ? (
          // In a real app, render GoogleMap component here
          <div className="absolute inset-0 bg-blue-100 dark:bg-slate-800">
            {/* Map Placeholder */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
               <MapPin className="h-8 w-8 text-red-500 mx-auto animate-bounce" />
               <p className="mt-2 font-medium bg-background/80 px-2 py-1 rounded">Driver Location<br/>
               {driverLocation?.lat.toFixed(4)}, {driverLocation?.lng.toFixed(4)}</p>
            </div>
          </div>
        ) : (
          <div className="text-center p-6">
            <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Tracking Driver...</h3>
            <p className="text-muted-foreground mt-2">Maps API Key not configured. Graceful fallback active.</p>
            {driverLocation && (
              <div className="mt-4 p-4 bg-background rounded-lg border inline-block text-left">
                <p className="text-sm font-medium">Last Known Coordinates:</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">LAT: {driverLocation.lat}</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">LNG: {driverLocation.lng}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <CardContent className="p-6 bg-background">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Truck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-lg">Out for Delivery</h4>
            <p className="text-muted-foreground text-sm">Your driver is on the way. Please keep your phone reachable.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
