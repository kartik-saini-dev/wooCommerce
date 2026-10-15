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
  PanelLeft,
  Search,
  ShieldAlert,
  Images,
  ExternalLink
} from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@repo/ui/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar"
import { ThemeToggle } from "@repo/ui/components/theme-toggle"
import { LanguageSelector } from "@repo/ui/components/layout/language-selector"
import { AdminBreadcrumbs } from "./admin-breadcrumbs"
import { signOut } from "next-auth/react"
import { siteConfig } from "@repo/ui/config/site"

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Box },
  { name: "Services", href: "/admin/services", icon: Wrench },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Bookings", href: "/admin/bookings", icon: BarChart3 }, 
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Media Library", href: "/admin/media", icon: Images },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Audit Logs", href: "/admin/logs", icon: ShieldAlert },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminNavbar() {
  const pathname = usePathname()

  const activeItem = [...navItems].sort((a, b) => b.href.length - a.href.length).find(item => pathname.startsWith(item.href));

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger aria-label="Toggle Navigation Menu" className="sm:hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Wrench className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="text-xl font-bold text-foreground">{siteConfig.adminName}</span>
            </Link>
            
            <div className="grid gap-2">
              {navItems.map((item) => {
                const isActive = activeItem?.href === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-4 px-2.5 py-2 rounded-md ${
                      isActive ? 'text-primary bg-primary/10 font-bold' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
      
      <AdminBreadcrumbs />
      
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <a
          href={process.env.NEXT_PUBLIC_CLIENT_URL || "https://woo-commerce-ccrv.vercel.app"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold px-2.5 sm:px-3 h-9 transition-colors shrink-0 shadow-xs"
          title="Open live client storefront in a new tab"
        >
          <ExternalLink className="h-3.5 w-3.5 text-primary" />
          <span className="hidden sm:inline">Live Store</span>
        </a>
        <LanguageSelector />
        <ThemeToggle />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger className="overflow-hidden rounded-full inline-flex items-center justify-center border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary">AD</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => window.open(process.env.NEXT_PUBLIC_CLIENT_URL || "https://woo-commerce-ccrv.vercel.app", "_blank")}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Live Storefront
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.location.href = '/admin/settings'}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.location.href = `mailto:${siteConfig.contact.email}`}>
            Support
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
