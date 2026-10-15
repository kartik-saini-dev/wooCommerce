"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { toast } from "sonner"
import { CldUploadWidget } from "next-cloudinary"
import { ImagePlus, CheckCircle2, Clock } from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import { Textarea } from "@repo/ui/components/ui/textarea"
import { Label } from "@repo/ui/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card"
import { Input } from "@repo/ui/components/ui/input"
import { createBooking } from "@repo/services/actions/booking"
import { Prisma, Address } from "@prisma/client"
import { siteConfig } from "@repo/ui/config/site"

type ServiceWithRelations = Prisma.ServiceGetPayload<{
  include: { images: true, category: true }
}>

export function BookingForm({ service, addresses }: { service: ServiceWithRelations, addresses: Address[] }) {
  const router = useRouter()
  const [isPending, setIsPending] = React.useState(false)
  const [selectedAddressId, setSelectedAddressId] = React.useState<string>(addresses[0]?.id || "")
  const [scheduledDate, setScheduledDate] = React.useState("")
  const [scheduledTime, setScheduledTime] = React.useState("")
  const [notes, setNotes] = React.useState("")
  const [images, setImages] = React.useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedAddressId) {
      toast.error("Please select a service address")
      return
    }

    if (!scheduledDate || !scheduledTime) {
      toast.error("Please select date and time")
      return
    }

    const dateTime = new Date(`${scheduledDate}T${scheduledTime}`)
    if (dateTime < new Date()) {
      toast.error("Booking time must be in the future")
      return
    }

    setIsPending(true)

    // Append image URLs to notes if any
    let finalNotes = notes
    if (images.length > 0) {
      finalNotes += "\n\nAttached Images:\n" + images.join("\n")
    }

    const dataToSubmit = {
      serviceId: service.id,
      scheduledDate: dateTime.toISOString(),
      serviceAddressId: selectedAddressId,
      notes: finalNotes
    }

    try {
      const result = await createBooking(dataToSubmit)

      if (result.success) {
        toast.success("Service booked successfully!")
        router.push(`/checkout/success/${result.bookingId}?type=booking`)
      } else {
        toast.error(result.error)
        setIsPending(false)
      }
    } catch (error) {
      console.error("Booking network error:", error)
      toast.error("Network error. Please check your connection and try again.")
      setIsPending(false)
    }
  }

  const formatCurrency = (val: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(val)

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-8">
        
        {/* Date & Time */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Preferred Date</Label>
                <Input 
                  type="date" 
                  id="date" 
                  value={scheduledDate} 
                  onChange={(e) => setScheduledDate(e.target.value)} 
                  required 
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Preferred Time</Label>
                <Input 
                  type="time" 
                  id="time" 
                  value={scheduledTime} 
                  onChange={(e) => setScheduledTime(e.target.value)} 
                  required 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle>Service Address</CardTitle>
          </CardHeader>
          <CardContent>
            {addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`relative rounded-xl border p-4 cursor-pointer transition-colors ${
                      selectedAddressId === addr.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedAddressId(addr.id)}
                  >
                    {selectedAddressId === addr.id && (
                      <CheckCircle2 className="absolute top-4 right-4 h-5 w-5 text-primary" />
                    )}
                    <p className="font-semibold">{addr.street}</p>
                    <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.postalCode}</p>
                    <p className="text-sm text-muted-foreground">{addr.country}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 border rounded-xl bg-muted/50">
                <p className="text-muted-foreground mb-4">No saved addresses found.</p>
                <Button type="button" variant="outline" onClick={() => router.push("/account/addresses")}>
                  Add Address in Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes & Images */}
        <Card>
          <CardHeader>
            <CardTitle>Problem Description (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="notes">Describe the issue you are facing</Label>
              <Textarea 
                id="notes" 
                placeholder="E.g., The AC is not cooling properly and makes a loud noise..." 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-4">
              <Label>Attach Photos (up to 3)</Label>
              <div className="flex flex-wrap gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative h-24 w-24 rounded-lg overflow-hidden border">
                    <Image src={img} alt="Problem image" fill className="object-cover" />
                  </div>
                ))}
                
                {images.length < 3 && (
                  <CldUploadWidget 
                    uploadPreset={siteConfig.cloudinary.uploadPreset}
                    onSuccess={(result: { info?: string | { secure_url: string } }) => {
                      if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
                        setImages(prev => [...prev, (result.info as { secure_url: string }).secure_url])
                      }
                    }}
                  >
                    {({ open }) => (
                      <button 
                        type="button" 
                        onClick={() => open()} 
                        className="h-24 w-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors bg-muted/30"
                      >
                        <ImagePlus className="h-6 w-6 mb-2" />
                        <span className="text-xs font-medium">Upload</span>
                      </button>
                    )}
                  </CldUploadWidget>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-4 space-y-6">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="h-16 w-16 bg-muted rounded-md relative overflow-hidden shrink-0">
                {service.images?.[0] ? (
                  <Image src={service.images[0].url} alt={service.name} fill className="object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">No img</div>
                )}
              </div>
              <div>
                <h4 className="font-semibold line-clamp-2">{service.name}</h4>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{service.category?.name}</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Base Price</span>
                <span className="font-medium">{formatCurrency(Number(service.basePrice))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Est. Duration</span>
                <span className="font-medium flex items-center"><Clock className="mr-1 h-3 w-3" /> {service.estimatedHrs} hrs</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <p>Payment is collected after the service is completed. Final price may vary based on inspection.</p>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base mt-2" disabled={isPending || addresses.length === 0}>
              {isPending ? "Confirming..." : "Confirm Booking"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
