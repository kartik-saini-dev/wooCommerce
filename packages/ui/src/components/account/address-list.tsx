"use client"

import * as React from "react"
import { useTransition } from "react"
import { toast } from "sonner"
import { MapPin, Plus, Trash2, Edit2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@repo/ui/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@repo/ui/components/ui/card"
import { Badge } from "@repo/ui/components/ui/badge"
import { Input } from "@repo/ui/components/ui/input"
import { Label } from "@repo/ui/components/ui/label"
import { Checkbox } from "@repo/ui/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog"
import { addAddress, updateAddress, deleteAddress } from "@repo/services/actions/address"
import { addressSchema } from "@repo/services/validations/address"

type AddressFormValues = z.infer<typeof addressSchema>

export function AddressList({ initialAddresses }: { initialAddresses: any[] }) {
  const [isPending, startTransition] = useTransition()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingAddress, setEditingAddress] = React.useState<any>(null)

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "", city: "", state: "", postalCode: "", country: "India", isDefault: false
    }
  })

  const isDefaultWatch = watch("isDefault")

  const openNewDialog = () => {
    setEditingAddress(null)
    reset({ street: "", city: "", state: "", postalCode: "", country: "India", isDefault: false })
    setIsDialogOpen(true)
  }

  const openEditDialog = (address: any) => {
    setEditingAddress(address)
    reset({
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      startTransition(async () => {
        try {
          const result = await deleteAddress(id)
          if (result.success) {
            toast.success("Address deleted successfully")
          } else {
            toast.error(result.error || "Failed to delete address")
          }
        } catch (error) {
          toast.error("Network error. Please check your connection and try again.")
        }
      })
    }
  }

  const onSubmit = (data: AddressFormValues) => {
    startTransition(async () => {
      try {
        let result;
        if (editingAddress) {
          result = await updateAddress(editingAddress.id, data)
        } else {
          result = await addAddress(data)
        }

        if (result.success) {
          toast.success(editingAddress ? "Address updated" : "Address added")
          setIsDialogOpen(false)
        } else {
          toast.error(result.error || "Failed to save address")
        }
      } catch (error) {
        toast.error("Network error. Please check your connection and try again.")
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button onClick={openNewDialog} />}>
            <div className="flex items-center"><Plus className="mr-2 h-4 w-4" /> Add New Address</div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
              <DialogDescription>Enter your shipping details below.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Street Address</Label>
                <Input {...register("street")} />
                {errors.street && <p className="text-sm text-destructive">{errors.street.message as string}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input {...register("city")} />
                  {errors.city && <p className="text-sm text-destructive">{errors.city.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input {...register("state")} />
                  {errors.state && <p className="text-sm text-destructive">{errors.state.message as string}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Postal Code</Label>
                  <Input {...register("postalCode")} />
                  {errors.postalCode && <p className="text-sm text-destructive">{errors.postalCode.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input {...register("country")} />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="isDefault" 
                  checked={isDefaultWatch} 
                  onCheckedChange={(c) => setValue("isDefault", c as boolean)} 
                />
                <Label htmlFor="isDefault">Set as default address</Label>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Address"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {initialAddresses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {initialAddresses.map((address) => (
            <Card key={address.id} className={address.isDefault ? "border-primary" : ""}>
              <CardHeader className="pb-3 flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {address.isDefault && <Badge variant="secondary">Default</Badge>}
                  </CardTitle>
                </div>
                <div className="flex gap-1 -mt-1.5 -mr-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(address)}>
                    <Edit2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(address.id)} disabled={isPending}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.postalCode}</p>
                <p>{address.country}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/30 border-dashed">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium">No saved addresses</h3>
          <p className="text-muted-foreground mt-1 mb-4">Add an address to speed up checkout.</p>
          <Button variant="outline" onClick={openNewDialog}>Add Address</Button>
        </div>
      )}
    </div>
  )
}
