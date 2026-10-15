"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { forgotPasswordSchema, type ForgotPasswordInput } from "@repo/services/validations/auth"
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { Label } from "@repo/ui/components/ui/label"
import { FormError } from "@repo/ui/components/ui/form-error"
import { FormSuccess } from "@repo/ui/components/ui/form-success"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useTranslation } from "@repo/services/i18n/LanguageContext"

export function ForgotPasswordForm() {
  const { t } = useTranslation()
  const [error, setError] = React.useState<string | undefined>("")
  const [success, setSuccess] = React.useState<string | undefined>("")
  const [isPending, setIsPending] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (values: ForgotPasswordInput) => {
    setError("")
    setSuccess("")
    setIsPending(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || t("auth.error") || "Something went wrong")
      } else {
        setSuccess(t("auth.forgotPasswordSuccess") || "If an account exists, a recovery email has been sent.")
      }
    } catch (err) {
      setError(t("auth.error") || "An unexpected error occurred.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-muted/60">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">{t("auth.forgotPassword") || "Forgot password"}</CardTitle>
        <CardDescription>
          {t("auth.forgotPasswordDesc") || "Enter your email address and we will send you a reset link"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.email") || "Email"}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("auth.emailPlaceholder") || "m@example.com"}
              disabled={isPending}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
            )}
          </div>
          
          <FormError message={error} />
          <FormSuccess message={success} />
          
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (t("auth.sendingLink") || "Sending link...") : (t("auth.sendResetLink") || "Send reset link")}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="text-center text-sm w-full">
          <Link href="/login" className="text-primary underline-offset-4 hover:underline px-0 font-normal flex items-center justify-center">
            <ArrowLeft className="h-4 w-4 mr-2" /> {t("auth.backToLogin") || "Back to login"}
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
