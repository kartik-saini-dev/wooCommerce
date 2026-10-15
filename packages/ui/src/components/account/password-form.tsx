"use client"

import * as React from "react"
import { useTransition } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { PasswordInput } from "@repo/ui/components/ui/password-input"
import { Label } from "@repo/ui/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@repo/ui/components/ui/card"
import { changePassword } from "@repo/services/actions/account"

import { changePasswordSchema } from "@repo/services/validations/account"

type PasswordFormValues = { currentPassword?: string; newPassword?: string }

export function PasswordForm() {
  const [isPending, startTransition] = useTransition()
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordFormValues>({
    resolver: zodResolver(changePasswordSchema)
  })

  const onSubmit = (data: any) => {
    startTransition(async () => {
      try {
        const result = await changePassword(data)
        if (result.success) {
          toast.success("Password changed successfully")
          reset()
        } else {
          toast.error(result.error || "Failed to change password")
        }
      } catch (error) {
        toast.error("Network error. Please check your connection and try again.")
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your password to keep your account secure.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <PasswordInput id="currentPassword" {...register("currentPassword")} />
            {errors.currentPassword && <p className="text-sm text-destructive">{errors.currentPassword?.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <PasswordInput id="newPassword" {...register("newPassword")} />
            {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword?.message as string}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending} variant="secondary">
            {isPending ? "Changing..." : "Change Password"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
