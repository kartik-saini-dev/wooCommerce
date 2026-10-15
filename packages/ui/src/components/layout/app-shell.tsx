"use client"

import React, { use, useEffect } from "react"
import { CartProvider, useCart } from "@repo/ui/components/shop/cart-provider"
import { ConditionalLayout } from "@repo/ui/components/layout/conditional-layout"
import { Navbar } from "@repo/ui/components/layout/navbar"
import { Footer } from "@repo/ui/components/layout/footer"
import { LanguageProvider } from "@repo/services/i18n/LanguageContext"


// This component uses React.use() to suspend only ITSELF, not the children of the layout.
// Actually, it can't be suspended without a Suspense boundary.
// Alternatively, we resolve the promise in a useEffect to completely avoid blocking SSR.

export function AppShell({ 
  userDataPromise, 
  children 
}: { 
  userDataPromise: Promise<any>,
  children: React.ReactNode 
}) {
  const [userData, setUserData] = React.useState<{cart: any, wishlistCount: number, userRole: string | null}>({ cart: null, wishlistCount: 0, userRole: null })
  
  useEffect(() => {
    userDataPromise.then(data => {
      setUserData(data)
    })
  }, [userDataPromise])

  return (
    <LanguageProvider initialLocale="en">
      <CartProvider initialCart={userData.cart}>
        <CartUpdater cart={userData.cart} />
        <ConditionalLayout 
          navbar={<Navbar wishlistCount={userData.wishlistCount} userRole={userData.userRole || undefined} />}
          footer={<Footer />}
        >
          {children}
        </ConditionalLayout>
      </CartProvider>
    </LanguageProvider>
  )
}

function CartUpdater({ cart }: { cart: any }) {
  // If we needed to dispatch to update the cart after initial mount, we would do it here.
  // But CartProvider's initialCart prop only works on mount.
  // Wait, if initialCart changes after mount, does it update?
  // In CartProvider, it uses useOptimistic which takes initialCart.
  // Next.js useOptimistic does update when the state passed to it changes!
  return null
}
