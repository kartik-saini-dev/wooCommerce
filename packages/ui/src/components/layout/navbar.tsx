"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, User, Search, Menu, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { siteConfig } from "@repo/ui/config/site"

import { cn } from "@repo/services/utils"
import { Button } from "@repo/ui/components/ui/button"
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const { t } = useTranslation()

  const NAV_LINKS = [
    { href: "/products", label: t("nav.products") || "Products" },
    { href: "/services", label: t("nav.services") || "Services" },
    { href: "/about", label: t("nav.about") || "About Us" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between gap-4">
        
        {/* Left Section: Mobile Toggle + Logo + Desktop Nav */}
        <div className="flex items-center gap-3 sm:gap-6 lg:gap-8 shrink-0">
          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none shrink-0"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 flex flex-col">
              <div className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>Main navigation menu for mobile devices</SheetDescription>
              </div>

              {/* Mobile Drawer Header */}
              <div className="flex items-center gap-2 p-6 border-b">
                <Package className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg tracking-tight">{siteConfig.name}</span>
              </div>

              {/* Mobile Drawer Navigation */}
              <div className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
                <div className="mb-4">
                  <React.Suspense fallback={<div className="h-9 w-full rounded-full border border-input bg-muted/20 opacity-50" />}>
                    <SearchBox onSearch={() => setIsMobileMenuOpen(false)} />
                  </React.Suspense>
                </div>

                <nav className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        pathname === link.href
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Mobile Drawer Footer Actions */}
              <div className="border-t p-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Preferences</span>
                <div className="flex items-center gap-2">
                  <LanguageSelector />
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Brand Logo - Visible across all screen sizes */}
          <Link href="/" className="flex items-center gap-2 shrink-0 select-none">
            <Package className="h-6 w-6 text-primary shrink-0" />
            <span className="font-bold text-lg sm:text-xl tracking-tight text-foreground whitespace-nowrap">
              {siteConfig.name}
            </span>
          </Link>
          
          {/* Desktop Navigation Links - Always horizontal, hidden on mobile */}
          <nav className="hidden md:flex flex-row items-center gap-6 lg:gap-8 shrink-0 flex-nowrap">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative inline-flex items-center text-sm font-medium whitespace-nowrap py-1 transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary font-semibold" : "text-muted-foreground"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Section: Search Bar + Actions */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 flex-1 min-w-0">
          {/* Desktop Search Bar */}
          <div className="hidden lg:block w-full max-w-xs xl:max-w-sm">
            <React.Suspense fallback={<div className="h-9 w-full rounded-full border border-input bg-muted/20 opacity-50" />}>
              <SearchBox />
            </React.Suspense>
          </div>
          
          {/* Mobile/Tablet Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden shrink-0 h-9 w-9 text-muted-foreground hover:text-foreground"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Toggle search bar"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <div className="hidden sm:flex items-center gap-1">
              <LanguageSelector />
              <ThemeToggle />
            </div>
            
            <Button render={<Link href="/wishlist" />} variant="ghost" size="icon" className="relative shrink-0 h-9 w-9" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 min-w-[16px] flex items-center justify-center rounded-full p-0 text-[10px] font-bold">
                  {wishlistCount}
                </Badge>
              )}
            </Button>

            <CartSheet />

            <Button render={<Link href={userRole === "ADMIN" ? "/admin/dashboard" : userRole ? "/account" : "/login"} />} variant="ghost" size="icon" className="shrink-0 h-9 w-9" aria-label="Account">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile/Tablet Collapsible Search Bar */}
      {isSearchOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t px-4 py-3 lg:hidden bg-background/95 backdrop-blur"
        >
          <div className="relative max-w-md mx-auto">
            <React.Suspense fallback={<div className="h-9 w-full rounded-full border border-input bg-muted/20 opacity-50" />}>
              <SearchBox onSearch={() => setIsSearchOpen(false)} />
            </React.Suspense>
          </div>
        </motion.div>
      )}
    </header>
  )
}
