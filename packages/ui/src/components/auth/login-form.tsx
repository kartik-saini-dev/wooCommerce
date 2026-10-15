"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"

import { phoneLoginSchema, otpSchema, type PhoneLoginInput, type OtpInput } from "@repo/services/validations/auth"
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { Label } from "@repo/ui/components/ui/label"
import { FormError } from "@repo/ui/components/ui/form-error"
import { FormSuccess } from "@repo/ui/components/ui/form-success"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/ui/card"
import { useTranslation } from "@repo/services/i18n/LanguageContext"

export function LoginForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  
  const [step, setStep] = React.useState<1 | 2>(1)
  const [phone, setPhone] = React.useState("")
  
  const [error, setError] = React.useState<string | undefined>("")
  const [success, setSuccess] = React.useState<string | undefined>("")
  const [isPending, setIsPending] = React.useState(false)

  const phoneForm = useForm<PhoneLoginInput>({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: { phone: "" },
  })

  const otpForm = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  })

  const onPhoneSubmit = async (values: PhoneLoginInput) => {
    setError("")
    setSuccess("")
    setIsPending(true)

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "phone", identifier: values.phone }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to send OTP")
      } else {
        setPhone(values.phone)
        setSuccess("OTP sent to your phone!")
        setStep(2)
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setIsPending(false)
    }
  }

  const onOtpSubmit = async (values: OtpInput) => {
    setError("")
    setSuccess("")
    setIsPending(true)

    try {
      const res = await signIn("customer-otp", {
        phone,
        otp: values.otp,
        redirect: false,
      })

      if (res?.error) {
        setError(res.error)
      } else {
        setSuccess("Login successful! Redirecting...")
        router.push(callbackUrl)
        router.refresh()
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
        <CardTitle className="text-2xl font-bold tracking-tight">Login</CardTitle>
        <CardDescription>
          {step === 1 ? "Enter your phone number to sign in" : `Enter the OTP sent to ${phone}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                disabled={isPending}
                {...phoneForm.register("phone")}
              />
              {phoneForm.formState.errors.phone && (
                <p className="text-sm font-medium text-destructive">{phoneForm.formState.errors.phone.message}</p>
              )}
            </div>
            
            <FormError message={error} />
            <FormSuccess message={success} />
            
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">6-Digit OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                maxLength={6}
                disabled={isPending}
                {...otpForm.register("otp")}
              />
              {otpForm.formState.errors.otp && (
                <p className="text-sm font-medium text-destructive">{otpForm.formState.errors.otp.message}</p>
              )}
            </div>
            
            <FormError message={error} />
            <FormSuccess message={success} />
            
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Verifying..." : "Verify & Sign In"}
            </Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => setStep(1)} disabled={isPending}>
              Back
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
