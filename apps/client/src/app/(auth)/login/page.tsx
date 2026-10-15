import { LoginForm } from "@repo/ui/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center py-10">
      <LoginForm />
    </div>
  )
}
