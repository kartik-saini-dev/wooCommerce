"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  BarChart3, 
  Box, 
  LayoutDashboard, 
  MessageSquare, 
  Package, 
  Settings, 
  ShoppingCart, 
  Users, 
  Wrench,
  Images,
  ShieldAlert
} from "lucide-react"

import { cn } from "@repo/services/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/components/ui/tooltip"
import { useTranslation } from "@repo/services/i18n/LanguageContext"

import { siteConfig } from "@repo/ui/config/site"

export function AdminSidebar() {
  const pathname = usePathname()
  const { t } = useTranslation()

  const navItems = [
    { name: t("admin.dashboard") || "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: t("admin.products") || "Products", href: "/admin/products", icon: Package },
    { name: t("admin.categories") || "Categories", href: "/admin/categories", icon: Box },
    { name: t("admin.services") || "Services", href: "/admin/services", icon: Wrench },
    { name: t("admin.serviceCategories") || "Service Categories", href: "/admin/services/categories", icon: Box },
    { name: t("admin.orders") || "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: t("admin.serviceBookings") || "Service Bookings", href: "/admin/bookings", icon: BarChart3 },
    { name: t("admin.customers") || "Customers", href: "/admin/customers", icon: Users },
    { name: t("admin.mediaLibrary") || "Media Library", href: "/admin/media", icon: Images },
    { name: t("admin.messages") || "Messages", href: "/admin/messages", icon: MessageSquare },
    { name: t("admin.auditLogs") || "Audit Logs", href: "/admin/logs", icon: ShieldAlert },
    { name: t("admin.settings") || "Settings", href: "/admin/settings", icon: Settings },
  ]

  const activeItem = [...navItems].sort((a, b) => b.href.length - a.href.length).find(item => pathname.startsWith(item.href));

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
      <div className="flex h-14 items-center border-b px-6 lg:h-[60px]">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Wrench className="h-6 w-6 text-primary" />
          <span className="text-xl tracking-tight">{siteConfig.adminName}</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeItem?.href === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:text-primary",
                  isActive 
                    ? "bg-primary/10 text-primary font-semibold" 
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
