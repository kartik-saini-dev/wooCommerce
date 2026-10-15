"use client"

import * as React from "react"
import { useFormState } from "react-dom"
import { createAdmin } from "./actions"
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { Label } from "@repo/ui/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card"
import { PasswordInput } from "@repo/ui/components/ui/password-input"
import { FormError } from "@repo/ui/components/ui/form-error"
import { FormSuccess } from "@repo/ui/components/ui/form-success"

const initialState = {
  error: null,
  success: false,
}

export default function NewAdminPage() {
  // @ts-ignore
  const [state, formAction] = useFormState(createAdmin, initialState)

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Add New Admin</h2>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Admin Details</CardTitle>
          <CardDescription>Create a new administrator account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required placeholder="John Doe" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="admin@example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" required placeholder="+1234567890" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput id="password" name="password" required />
            </div>

            {state?.error && <FormError message={state.error} />}
            {state?.success && <FormSuccess message="Admin created successfully!" />}

            <Button type="submit" className="w-full">
              Create Admin
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

