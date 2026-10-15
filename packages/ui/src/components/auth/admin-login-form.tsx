"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import * as z from "zod"
import { KeyRound, ShieldCheck, ExternalLink, Sparkles } from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { PasswordInput } from "@repo/ui/components/ui/password-input"
import { Label } from "@repo/ui/components/ui/label"
import { FormError } from "@repo/ui/components/ui/form-error"
import { FormSuccess } from "@repo/ui/components/ui/form-success"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card"

const adminLoginSchema = z.object({
  email: z.string().min(1, { message: "Email or username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
})

type AdminLoginInput = z.infer<typeof adminLoginSchema>

export function AdminLoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard"
  
  const [error, setError] = React.useState<string | undefined>("")
  const [success, setSuccess] = React.useState<string | undefined>("")
  const [isPending, setIsPending] = React.useState(false)

  // Pre-filled with demo credentials by default for IT company & evaluators
  const credentialsForm = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "admin@example.com", password: "admin123" },
  })

  const onCredentialsSubmit = async (values: AdminLoginInput) => {
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
        setSuccess("Login successful! Redirecting to admin dashboard...")
        window.location.href = callbackUrl
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setIsPending(false)
    }
  }

  const handleQuickDemoLogin = async () => {
    credentialsForm.setValue("email", "admin@example.com")
    credentialsForm.setValue("password", "admin123")
    await onCredentialsSubmit({ email: "admin@example.com", password: "admin123" })
  }

  const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL || "https://woo-commerce-ccrv.vercel.app"

  return (
    <div className="w-full max-w-md space-y-4">
      <Card className="shadow-lg border-muted/60">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Admin Portal</CardTitle>
          <CardDescription>
            Sign in to manage products, orders, and services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* IT Reviewer & Evaluator Access Banner */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-primary flex items-center gap-1.5">
                <KeyRound className="h-4 w-4" /> Demo Access Credentials
              </span>
              <Button
                type="button"
                variant="outline"
                size="xs"
                className="h-6 text-[11px] font-medium border-primary/30 text-primary hover:bg-primary/10"
                onClick={() => {
                  credentialsForm.setValue("email", "admin@example.com")
                  credentialsForm.setValue("password", "admin123")
                }}
              >
                Auto-Fill
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-muted-foreground bg-background/60 rounded-lg p-2 border border-border/40 font-mono text-[11px]">
              <div>
                <span className="block text-[10px] uppercase font-sans text-muted-foreground/70">Username</span>
                <span className="text-foreground font-semibold">admin@example.com</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-sans text-muted-foreground/70">Password</span>
                <span className="text-foreground font-semibold">admin123</span>
              </div>
            </div>
            <div className="mt-2.5">
              <Button
                type="button"
                variant="default"
                size="sm"
                className="w-full text-xs h-8 gap-1.5 bg-primary/90 hover:bg-primary"
                onClick={handleQuickDemoLogin}
                disabled={isPending}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>1-Click Instant Demo Login</span>
              </Button>
            </div>
          </div>

          <form onSubmit={credentialsForm.handleSubmit(onCredentialsSubmit)} className="space-y-4 pt-1">
            <div className="space-y-2">
              <Label htmlFor="email">Email or Username</Label>
              <Input
                id="email"
                type="text"
                placeholder="admin@example.com or admin"
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
                <a href="/forgot-password" className="text-xs text-primary hover:underline" tabIndex={-1}>
                  Forgot password?
                </a>
              </div>
              <PasswordInput
                id="password"
                placeholder="admin123 or 123"
                disabled={isPending}
                {...credentialsForm.register("password")}
              />
              {credentialsForm.formState.errors.password && (
                <p className="text-sm font-medium text-destructive">{credentialsForm.formState.errors.password.message}</p>
              )}
            </div>
            
            <FormError message={error} />
            <FormSuccess message={success} />
            
            <Button type="submit" className="w-full font-semibold" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign In to Admin"}
            </Button>
          </form>

          {/* Link to live storefront */}
          <div className="pt-3 border-t text-center">
            <a
              href={clientUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-medium group"
            >
              <span>Visit Client Website (Storefront)</span>
              <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
