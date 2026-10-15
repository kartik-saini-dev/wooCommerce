"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"

import { resetPasswordSchema, type ResetPasswordInput } from "@repo/services/validations/auth"
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { PasswordInput } from "@repo/ui/components/ui/password-input"
import { Label } from "@repo/ui/components/ui/label"
import { FormError } from "@repo/ui/components/ui/form-error"
import { FormSuccess } from "@repo/ui/components/ui/form-success"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card"
import { useTranslation } from "@repo/services/i18n/LanguageContext"

export function ResetPasswordForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [error, setError] = React.useState<string | undefined>("")
  const [success, setSuccess] = React.useState<string | undefined>("")
  const [isPending, setIsPending] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: ResetPasswordInput) => {
    if (!token) {
      setError(t("auth.missingToken") || "Missing reset token")
      return
    }

    setError("")
    setSuccess("")
    setIsPending(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, token }),
      })
      
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || t("auth.error") || "Something went wrong")
      } else {
        setSuccess(t("auth.resetSuccess") || "Password reset successfully. You can now login.")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch (err) {
      setError(t("auth.error") || "An unexpected error occurred.")
    } finally {
      setIsPending(false)
    }
  }

  if (!token) {
    return (
      <Card className="w-full max-w-md shadow-lg border-muted/60">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-destructive">{t("auth.invalidLink") || "Invalid Link"}</CardTitle>
          <CardDescription>
            {t("auth.invalidLinkDesc") || "The password reset link is invalid or has expired."}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-muted/60">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">{t("auth.resetPassword") || "Reset password"}</CardTitle>
        <CardDescription>
          {t("auth.resetPasswordDesc") || "Enter your new password below"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.password") || "New Password"}</Label>
            <PasswordInput
              id="password"
              disabled={isPending}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm font-medium text-destructive">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("auth.confirmPassword") || "Confirm New Password"}</Label>
            <PasswordInput
              id="confirmPassword"
              disabled={isPending}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm font-medium text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          <FormError message={error} />
          <FormSuccess message={success} />
          
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (t("auth.resetting") || "Resetting...") : (t("auth.resetPassword") || "Reset password")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
