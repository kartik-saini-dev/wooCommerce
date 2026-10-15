"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, User, Search, Menu, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { siteConfig } from "@repo/ui/config/site"

import { cn } from "@repo/services/utils"
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { ThemeToggle } from "@repo/ui/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@repo/ui/components/ui/sheet"
import { CartSheet } from "@repo/ui/components/shop/cart-sheet"
import { Badge } from "@repo/ui/components/ui/badge"
import { SearchBox } from "@repo/ui/components/layout/search-box"
import { LanguageSelector } from "@repo/ui/components/layout/language-selector"
import { useTranslation } from "@repo/services/i18n/LanguageContext"

export function Navbar({ wishlistCount = 0, userRole }: { wishlistCount?: number, userRole?: string }) {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const { t } = useTranslation()

  const NAV_LINKS = [
    { href: "/products", label: t("nav.products") },
    { href: "/services", label: t("nav.services") },
    { href: "/about", label: t("nav.about") },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-colors">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" tabIndex={-1} className="md:hidden" />}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>Main navigation for the application</SheetDescription>
              </div>
              <div className="flex flex-col gap-6 pl-2 pt-4">
                <Link href="/" className="flex items-center space-x-2">
                  <Package className="h-6 w-6 text-primary" />
                  <span className="font-bold text-lg">{siteConfig.name}</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        pathname === link.href ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center space-x-2 hidden md:flex">
            <Package className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold text-xl tracking-tight">{siteConfig.name}</span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-[22px] left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          <div className="w-full max-w-sm hidden lg:flex items-center relative">
            <React.Suspense fallback={<div className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm opacity-50" />}>
              <SearchBox />
            </React.Suspense>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          <nav className="flex items-center space-x-1">
            <LanguageSelector />
            <ThemeToggle />
            
            <Button render={<Link href="/wishlist" />} variant="ghost" size="icon" className="relative" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs">
                  {wishlistCount}
                </Badge>
              )}
            </Button>

            <CartSheet />

            <Button render={<Link href={userRole === "ADMIN" ? "/admin/dashboard" : userRole ? "/account" : "/login"} />} variant="ghost" size="icon" aria-label="Account">
              <User className="h-5 w-5" />
            </Button>
          </nav>
        </div>
      </div>
      
      {/* Mobile Search Bar Expansion */}
      {isSearchOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="border-t p-4 lg:hidden bg-background"
        >
          <div className="relative">
            <React.Suspense fallback={<div className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm opacity-50" />}>
              <SearchBox onSearch={() => setIsSearchOpen(false)} />
            </React.Suspense>
          </div>
        </motion.div>
      )}
    </header>
  )
}
