import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

import { authOptions } from "@repo/services/auth"
import { AddressRepository } from "@repo/services/repositories/address"
import { AddressList } from "@repo/ui/components/account/address-list"

export const metadata = { title: "Addresses | My Account" }

export default async function AddressesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login?callbackUrl=/account/addresses")

  const addresses = await AddressRepository.getUserAddresses(session.user.id)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Saved Addresses</h2>
        <p className="text-muted-foreground">Manage your shipping and billing addresses.</p>
      </div>

      <AddressList initialAddresses={addresses} />
    </div>
  )
}
