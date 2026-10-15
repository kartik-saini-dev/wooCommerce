"use client"

import * as React from "react"
import { useTransition } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { Label } from "@repo/ui/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@repo/ui/components/ui/card"
import { updateProfile } from "@repo/services/actions/account"

import { updateProfileSchema } from "@repo/services/validations/account"
type ProfileFormValues = { name?: string }

export function ProfileForm({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition()
  
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name || ""
    }
  })

  const onSubmit = (data: ProfileFormValues) => {
    startTransition(async () => {
      try {
        const result = await updateProfile(data as any)
        if (result.success) {
          toast.success("Profile updated successfully")
        } else {
          toast.error(result.error || "Failed to update profile")
        }
      } catch (error) {
        toast.error("Network error. Please check your connection and try again.")
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your display name.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={user.email} disabled />
            <p className="text-xs text-muted-foreground">Your email address cannot be changed.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name?.message as string}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
