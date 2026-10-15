"use client"

import React, { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { MapPin, Store, Truck, CheckCircle } from "lucide-react"

// Fix Leaflet's default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

// Custom SVG Icons
const createIcon = (svgString: string, color: string) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid white;">${svgString}</div>`,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  })
}

const shopIcon = createIcon(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>`, "#0f172a")
const homeIcon = createIcon(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`, "#16a34a")
const deliveryIcon = createIcon(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v5c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><path d="M15 18H9"/><circle cx="17" cy="18" r="2"/></svg>`, "#2563eb")

export default function TrackingMap({ orderId }: { orderId: string }) {
  // Demo coordinates (Shop to a nearby home)
  const shopCoord: [number, number] = [28.6139, 77.2090] // New Delhi center
  const homeCoord: [number, number] = [28.5355, 77.2410] // Some distance away
  
  const [deliveryCoord, setDeliveryCoord] = useState<[number, number]>(shopCoord)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("CONFIRMED")
  
  useEffect(() => {
    // Simulate movement
    const steps = 100
    let currentStep = 0
    
    // Quick demo speed: 10 seconds to deliver
    const interval = setInterval(() => {
      currentStep += 1
      setProgress(currentStep)
      
      if (currentStep <= steps) {
        if (currentStep === 10) setStatus("DISPATCHED")
        if (currentStep === 50) setStatus("OUT_FOR_DELIVERY")
        if (currentStep === 100) setStatus("DELIVERED")
        
        // Linear interpolation
        const lat = shopCoord[0] + (homeCoord[0] - shopCoord[0]) * (currentStep / steps)
        const lng = shopCoord[1] + (homeCoord[1] - shopCoord[1]) * (currentStep / steps)
        setDeliveryCoord([lat, lng])
      } else {
        clearInterval(interval)
      }
    }, 100)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Delivery Status</h2>
        
        <div className="w-full max-w-2xl">
          <div className="flex justify-between mb-2 text-sm font-semibold">
            <span className={status === "CONFIRMED" ? "text-primary" : "text-muted-foreground"}>Confirmed</span>
            <span className={status === "DISPATCHED" ? "text-primary" : "text-muted-foreground"}>Dispatched</span>
            <span className={status === "OUT_FOR_DELIVERY" ? "text-primary" : "text-muted-foreground"}>On the Way</span>
            <span className={status === "DELIVERED" ? "text-green-600" : "text-muted-foreground"}>Delivered</span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          {status === "DELIVERED" ? (
            <div className="text-green-600 font-bold text-2xl flex items-center justify-center gap-2">
              <CheckCircle className="h-8 w-8" />
              Successfully Delivered!
            </div>
          ) : (
            <div className="text-lg">
              Estimated Delivery: <strong>In a few minutes</strong>
            </div>
          )}
        </div>
      </div>
      
      <div className="h-[500px] w-full rounded-2xl overflow-hidden border shadow-sm relative z-0">
        <MapContainer center={shopCoord} zoom={11} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker position={shopCoord} icon={shopIcon}>
            <Popup>Our Shop</Popup>
          </Marker>
          
          <Marker position={homeCoord} icon={homeIcon}>
            <Popup>Your Home</Popup>
          </Marker>
          
          <Polyline positions={[shopCoord, homeCoord]} color="#cbd5e1" dashArray="5, 10" />
          <Polyline positions={[shopCoord, deliveryCoord]} color="#2563eb" weight={4} />
          
          {status !== "DELIVERED" && (
            <Marker position={deliveryCoord} icon={deliveryIcon}>
              <Popup>Delivery Boy</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  )
}
