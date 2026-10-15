"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, MapPin, Package, Calendar, Settings, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

import { useTranslation } from "@repo/services/i18n/LanguageContext"
import { cn } from "@repo/services/utils"

export function AccountSidebar() {
  const pathname = usePathname()
  const { t } = useTranslation()

  const sidebarNavItems = [
    { title: t("nav.dashboard") || "Dashboard", href: "/account", icon: User },
    { title: t("account.profile") || "My Profile", href: "/account/profile", icon: Settings },
    { title: t("account.addresses") || "Addresses", href: "/account/addresses", icon: MapPin },
    { title: t("account.myOrders") || "My Orders", href: "/account/orders", icon: Package },
    { title: t("account.serviceBookings") || "Service Bookings", href: "/account/bookings", icon: Calendar },
  ]

  return (
    <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
      {sidebarNavItems.map((item) => {
        const Icon = item.icon
        // For Dashboard exact match is better so it doesn't stay highlighted on /account/profile, but keeping original logic for safety
        const isActive = pathname === item.href || (item.href !== "/account" && pathname.startsWith(item.href + "/"))
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary whitespace-nowrap",
              isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        )
      })}
      <div className="hidden lg:block my-2 h-px bg-border" />
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-destructive/10 text-destructive whitespace-nowrap text-left"
      >
        <LogOut className="h-4 w-4" />
        {t("nav.logout") || "Sign Out"}
      </button>
    </nav>
  )
}
