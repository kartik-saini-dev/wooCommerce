"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"

import { loginSchema, type LoginInput } from "@repo/services/validations/auth"
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { PasswordInput } from "@repo/ui/components/ui/password-input"
import { Label } from "@repo/ui/components/ui/label"
import { FormError } from "@repo/ui/components/ui/form-error"
import { FormSuccess } from "@repo/ui/components/ui/form-success"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card"

export function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard"
  
  const [error, setError] = React.useState<string | undefined>("")
  const [success, setSuccess] = React.useState<string | undefined>("")
  const [isPending, setIsPending] = React.useState(false)

  const credentialsForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onCredentialsSubmit = async (values: LoginInput) => {
    setError("")
    setSuccess("")
    setIsPending(true)

    try {
      const res = await signIn("admin-login", {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (res?.error) {
        setError(res.error)
      } else {
        setSuccess("Login successful! Redirecting...")
        window.location.href = callbackUrl
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-muted/60">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Admin Portal</CardTitle>
        <CardDescription>
          Sign in with your email and password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={credentialsForm.handleSubmit(onCredentialsSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              disabled={isPending}
              {...credentialsForm.register("email")}
            />
            {credentialsForm.formState.errors.email && (
              <p className="text-sm font-medium text-destructive">{credentialsForm.formState.errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="/forgot-password" className="text-sm text-primary hover:underline" tabIndex={-1}>
                Forgot password?
              </a>
            </div>
            <PasswordInput
              id="password"
              disabled={isPending}
              {...credentialsForm.register("password")}
            />
            {credentialsForm.formState.errors.password && (
              <p className="text-sm font-medium text-destructive">{credentialsForm.formState.errors.password.message}</p>
            )}
          </div>
          
          <FormError message={error} />
          <FormSuccess message={success} />
          
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
