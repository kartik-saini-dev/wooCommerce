"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"

import { registerSchema, type RegisterInput } from "@repo/services/validations/auth"
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { PasswordInput } from "@repo/ui/components/ui/password-input"
import { Label } from "@repo/ui/components/ui/label"
import { FormError } from "@repo/ui/components/ui/form-error"
import { FormSuccess } from "@repo/ui/components/ui/form-success"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/ui/card"
import Link from "next/link"
import { useTranslation } from "@repo/services/i18n/LanguageContext"

export function RegisterForm() {
  const { t } = useTranslation()
  const router = useRouter()
  
  const [error, setError] = React.useState<string | undefined>("")
  const [success, setSuccess] = React.useState<string | undefined>("")
  const [isPending, setIsPending] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: RegisterInput) => {
    setError("")
    setSuccess("")
    setIsPending(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || t("auth.error") || "Something went wrong")
      } else {
        setSuccess(t("auth.registerSuccess") || "Account created successfully! You can now sign in.")
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

  return (
    <Card className="w-full max-w-md shadow-lg border-muted/60">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">{t("auth.registerTitle") || "Create an account"}</CardTitle>
        <CardDescription>
          {t("auth.registerDesc") || "Enter your details below to create your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("form.name") || "Full Name"}</Label>
            <Input
              id="name"
              type="text"
              placeholder={t("form.namePlaceholder") || "John Doe"}
              disabled={isPending}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("form.email") || "Email"}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("form.emailPlaceholder") || "m@example.com"}
              disabled={isPending}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("form.password") || "Password"}</Label>
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
            <Label htmlFor="confirmPassword">{t("form.confirmPassword") || "Confirm Password"}</Label>
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
            {isPending ? (t("auth.creatingAccount") || "Creating account...") : (t("auth.createAccount") || "Create account")}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm text-muted-foreground mt-2">
          {t("auth.hasAccount") || "Already have an account?"}{" "}
          <Link href="/login" className="font-medium text-primary hover:underline underline-offset-4">
            {t("auth.signIn") || "Sign in"}
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
