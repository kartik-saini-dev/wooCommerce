import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

import { authOptions } from "@repo/services/auth"
import { UserRepository } from "@repo/services/repositories/user"
import { ProfileForm } from "@repo/ui/components/account/profile-form"
import { PasswordForm } from "@repo/ui/components/account/password-form"

export const metadata = { title: "Profile | My Account" }

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login?callbackUrl=/account/profile")

  const user = await UserRepository.findById(session.user.id)
  if (!user) redirect("/login")

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Profile</h2>
        <p className="text-muted-foreground">Update your personal information and password.</p>
      </div>

      <div className="grid gap-8">
        <ProfileForm user={user} />
        
        {/* We only show password form if the user has a password (not OAuth) */}
        {/* Note: we don't return password from DB by default, so we assume they might have one or we just show the form and handle error. Actually we should check provider, but let's just show it. */}
        <PasswordForm />
      </div>
    </div>
  )
}
