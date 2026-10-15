"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { toast } from "sonner"
import { CldUploadWidget } from "next-cloudinary"
import { CheckCircle2, CreditCard, Banknote, ImagePlus, Loader2 } from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { Label } from "@repo/ui/components/ui/label"
import { processCheckout, saveAddress } from "@repo/services/actions/checkout"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@repo/ui/components/ui/card"
import { Separator } from "@repo/ui/components/ui/separator"
import { useTranslation } from "@repo/services/i18n/LanguageContext"
import { Prisma, Address } from "@prisma/client"
import { siteConfig } from "@repo/ui/config/site"
import { StoreConfiguration } from "@repo/services/services/config.service"

type CartWithItems = Prisma.CartGetPayload<{
  include: { items: { include: { product: true } } }
}>

export function CheckoutForm({ cart, addresses: initialAddresses, config }: { cart: CartWithItems | null, addresses: Address[], config: StoreConfiguration }) {
  const { t } = useTranslation()
  const router = useRouter()
  const [addresses, setAddresses] = React.useState(initialAddresses)
  const [isPending, setIsPending] = React.useState(false)
  const [deliveryMethod, setDeliveryMethod] = React.useState<"HOME_DELIVERY" | "PICKUP">("HOME_DELIVERY")
  const [selectedAddressId, setSelectedAddressId] = React.useState<string>(addresses[0]?.id || "")
  const [paymentMethod, setPaymentMethod] = React.useState<string>("COD")
  const [transactionId, setTransactionId] = React.useState("")
  const [paymentProofUrl, setPaymentProofUrl] = React.useState("")

  const [isAddingAddress, setIsAddingAddress] = React.useState(false)
  const [isSavingAddress, setIsSavingAddress] = React.useState(false)
  const [newAddress, setNewAddress] = React.useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India"
  })

  const handleSaveAddress = async () => {
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.postalCode) {
      toast.error("Please fill all address fields")
      return
    }
    setIsSavingAddress(true)
    try {
      const res = await saveAddress(newAddress)
      if (res.success && res.address) {
        toast.success("Address saved")
        setAddresses([res.address, ...addresses])
        setSelectedAddressId(res.address.id)
        setIsAddingAddress(false)
        setNewAddress({ street: "", city: "", state: "", postalCode: "", country: "India" })
      } else {
        toast.error(res.error || "Failed to save address")
      }
    } catch (e) {
      toast.error("Network error")
    } finally {
      setIsSavingAddress(false)
    }
  }

  const items = cart?.items || []
  const subtotal = items.reduce((total: number, item) => total + (Number(item.product.price) * item.quantity), 0)
  
  const shipping = deliveryMethod === "HOME_DELIVERY" 
    ? (subtotal >= config.FREE_DELIVERY_THRESHOLD ? 0 : config.BASE_DELIVERY_FEE)
    : 0

  const tax = subtotal * 0.18 // Or from config.TAX_RATE if added
  const total = subtotal + shipping + tax

  const formatCurrency = (val: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(val)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (deliveryMethod === "HOME_DELIVERY" && !selectedAddressId) {
      toast.error("Please select a shipping address")
      return
    }

    if (paymentMethod === "UPI" && (!transactionId || !paymentProofUrl)) {
      toast.error("Please provide UPI Transaction ID and Screenshot")
      return
    }

    setIsPending(true)
    try {
      const result = await processCheckout({
        deliveryMethod,
        shippingAddressId: deliveryMethod === "HOME_DELIVERY" ? selectedAddressId : undefined,
        billingAddressId: deliveryMethod === "HOME_DELIVERY" ? selectedAddressId : undefined,
        paymentMethod,
        transactionId: paymentMethod === "UPI" ? transactionId : undefined,
        paymentProofUrl: paymentMethod === "UPI" ? paymentProofUrl : undefined
      })

      if (result.success) {
        toast.success("Order placed successfully!")
        router.push(`/checkout/pay/${result.orderId}`)
      } else {
        toast.error(result.error)
        setIsPending(false)
      }
    } catch (error) {
      console.error("Checkout network error:", error)
      toast.error("Network error. Please check your connection and try again.")
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-8">
        
        {/* Delivery Method Selection */}
        <Card>
          <CardHeader>
            <CardTitle>{t("shop.deliveryMethod") || "Delivery Method"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className={`rounded-xl border p-4 cursor-pointer transition-colors ${
                  deliveryMethod === "HOME_DELIVERY" ? "border-primary bg-primary/5" : "hover:border-primary/50"
                }`}
                onClick={() => setDeliveryMethod("HOME_DELIVERY")}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Home Delivery</h4>
                  {deliveryMethod === "HOME_DELIVERY" && <CheckCircle2 className="h-5 w-5 text-primary" />}
                </div>
                <p className="text-sm text-muted-foreground">Deliver to your doorstep</p>
                {subtotal >= config.FREE_DELIVERY_THRESHOLD && (
                  <p className="text-sm text-green-600 mt-2 font-medium">Eligible for Free Delivery</p>
                )}
              </div>
              <div
                className={`rounded-xl border p-4 cursor-pointer transition-colors ${
                  deliveryMethod === "PICKUP" ? "border-primary bg-primary/5" : "hover:border-primary/50"
                }`}
                onClick={() => setDeliveryMethod("PICKUP")}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Store Pickup</h4>
                  {deliveryMethod === "PICKUP" && <CheckCircle2 className="h-5 w-5 text-primary" />}
                </div>
                <p className="text-sm text-muted-foreground">Collect from our shop</p>
                <p className="text-sm text-primary mt-2 font-medium">Free</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Section - Only show if HOME_DELIVERY */}
        {deliveryMethod === "HOME_DELIVERY" && (
        <Card>
          <CardHeader>
            <CardTitle>{t("shop.shippingAddress")}</CardTitle>
          </CardHeader>
          <CardContent>
            {addresses.length > 0 ? (
              <div className="space-y-6">
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
                {!isAddingAddress ? (
                  <Button type="button" variant="outline" onClick={() => setIsAddingAddress(true)}>
                    + Add New Address
                  </Button>
                ) : (
                  <div className="p-4 border rounded-xl space-y-4 bg-muted/20">
                    <h4 className="font-medium">New Address</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2 sm:col-span-2">
                        <Label>Street Address (Line 1 & 2)</Label>
                        <Input value={newAddress.street} onChange={(e) => setNewAddress({...newAddress, street: e.target.value})} placeholder="123 Main St, Apt 4B" />
                      </div>
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} placeholder="Mumbai" />
                      </div>
                      <div className="space-y-2">
                        <Label>State</Label>
                        <Input value={newAddress.state} onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} placeholder="Maharashtra" />
                      </div>
                      <div className="space-y-2">
                        <Label>PIN Code</Label>
                        <Input value={newAddress.postalCode} onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})} placeholder="400001" />
                      </div>
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Input value={newAddress.country} onChange={(e) => setNewAddress({...newAddress, country: e.target.value})} placeholder="India" disabled />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" disabled={isSavingAddress} onClick={handleSaveAddress}>
                        {isSavingAddress ? "Saving..." : "Save Address"}
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => setIsAddingAddress(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 border rounded-xl space-y-4 bg-muted/20">
                  <h4 className="font-medium">Add Delivery Address</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Street Address (Line 1 & 2)</Label>
                      <Input value={newAddress.street} onChange={(e) => setNewAddress({...newAddress, street: e.target.value})} placeholder="123 Main St, Apt 4B" />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} placeholder="Mumbai" />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input value={newAddress.state} onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} placeholder="Maharashtra" />
                    </div>
                    <div className="space-y-2">
                      <Label>PIN Code</Label>
                      <Input value={newAddress.postalCode} onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})} placeholder="400001" />
                    </div>
                  </div>
                  <Button type="button" className="w-full sm:w-auto" disabled={isSavingAddress} onClick={handleSaveAddress}>
                    {isSavingAddress ? "Saving..." : "Save Address"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        )}

        {/* Pickup Info - Only show if PICKUP */}
        {deliveryMethod === "PICKUP" && (
          <Card>
            <CardHeader>
              <CardTitle>Pickup Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-xl bg-muted/20">
                <p className="text-sm text-muted-foreground">Your order will be prepared in approximately {config.PREPARATION_TIME_HOURS} hours.</p>
                <p className="text-sm font-medium mt-2 text-foreground">You will receive an exact pickup slot after placing the order.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Section */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                  paymentMethod === "COD" ? "border-primary bg-primary/5" : "hover:border-primary/50"
                }`}
                onClick={() => setPaymentMethod("COD")}
              >
                <Banknote className={`h-6 w-6 ${paymentMethod === "COD" ? "text-primary" : "text-muted-foreground"}`} />
                <span className="font-medium">Cash on Delivery</span>
              </div>
              <div
                className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                  paymentMethod === "UPI" ? "border-primary bg-primary/5" : "hover:border-primary/50"
                }`}
                onClick={() => setPaymentMethod("UPI")}
              >
                <CreditCard className={`h-6 w-6 ${paymentMethod === "UPI" ? "text-primary" : "text-muted-foreground"}`} />
                <span className="font-medium">Manual UPI (QR Code)</span>
              </div>
            </div>

            {paymentMethod === "UPI" && (
              <div className="rounded-xl border p-6 bg-muted/30 space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-48 h-48 bg-white p-2 rounded-xl border flex items-center justify-center shrink-0">
                    <div className="text-center text-xs text-muted-foreground">
                      [UPI QR Code Placeholder]<br/>
                      scan to pay
                    </div>
                  </div>
                  <div className="space-y-2 text-center md:text-left">
                    <h4 className="font-semibold text-lg">Scan & Pay {formatCurrency(total)}</h4>
                    <p className="text-muted-foreground">UPI ID: <strong>{siteConfig.payment.upiId}</strong></p>
                    <p className="text-sm text-muted-foreground">Please complete the payment on your UPI app and enter the 12-digit transaction ID below along with a screenshot.</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="grid gap-2">
                    <Label htmlFor="transactionId">Transaction ID (UTR)</Label>
                    <Input
                      id="transactionId"
                      placeholder="e.g. 123456789012"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      required={paymentMethod === "UPI"}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Payment Screenshot</Label>
                    {paymentProofUrl ? (
                      <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden border">
                        <Image src={paymentProofUrl} alt="Payment Proof" fill className="object-cover" />
                      </div>
                    ) : (
                      <CldUploadWidget 
                        uploadPreset={siteConfig.cloudinary.uploadPreset}
                        onSuccess={(result: { info?: string | { secure_url: string } }) => {
                          if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
                            setPaymentProofUrl(result.info.secure_url)
                          }
                        }}
                      >
                        {({ open }) => (
                          <Button type="button" variant="outline" onClick={() => open()} className="w-full max-w-sm border-dashed">
                            <ImagePlus className="mr-2 h-4 w-4" />
                            Upload Screenshot
                          </Button>
                        )}
                      </CldUploadWidget>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-4 space-y-6">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>{t("shop.orderSummary")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground line-clamp-1 flex-1 pr-4">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="font-medium whitespace-nowrap">
                    {formatCurrency(Number(item.product.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax ({siteConfig.tax.defaultRate}% GST)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
            </div>

            <Separator className="my-4" />
            <div className="flex items-center justify-between font-bold">
              <span>{t("shop.total")}</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" size="lg" disabled={isPending || items.length === 0}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("shop.processing")}
                </>
              ) : (
                t("shop.placeOrder")
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}
