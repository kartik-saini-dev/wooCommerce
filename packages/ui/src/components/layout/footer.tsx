"use client"

import Link from "next/link"
import { Package } from "lucide-react"
import { useTranslation } from "@repo/services/i18n/LanguageContext"
import { siteConfig } from "@repo/ui/config/site"

export function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="w-full border-t bg-muted/50 dark:bg-muted/10 transition-colors">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-8">
          
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl tracking-tight">{siteConfig.name}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t("footer.description") || siteConfig.description}
            </p>
            <div className="flex space-x-4 pt-2">
              <Link href="#facebook" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Facebook
              </Link>
              <Link href="#twitter" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Twitter
              </Link>
              <Link href="#instagram" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Instagram
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-5">{t("footer.categories")}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/products?category=wiring" className="hover:text-primary transition-colors">{t("footer.catWiring")}</Link></li>
              <li><Link href="/products?category=lighting" className="hover:text-primary transition-colors">{t("footer.catLighting")}</Link></li>
              <li><Link href="/products?category=appliances" className="hover:text-primary transition-colors">{t("footer.catAppliances")}</Link></li>
              <li><Link href="/products?category=switches" className="hover:text-primary transition-colors">{t("footer.catSwitches")}</Link></li>
              <li><Link href="/products?category=accessories" className="hover:text-primary transition-colors">{t("footer.catAccessories")}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-5">{t("footer.services")}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/services/book" className="hover:text-primary transition-colors">{t("footer.servAC")}</Link></li>
              <li><Link href="/services/book" className="hover:text-primary transition-colors">{t("footer.servInverter")}</Link></li>
              <li><Link href="/services/book" className="hover:text-primary transition-colors">{t("footer.servWiring")}</Link></li>
              <li><Link href="/services/book" className="hover:text-primary transition-colors">{t("footer.servFan")}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-5">{t("footer.contact")}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex flex-col">
                <span className="font-medium text-foreground">{t("footer.support")}</span>
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-primary transition-colors">{siteConfig.contact.email}</a>
              </li>
              <li className="flex flex-col pt-2">
                <span className="font-medium text-foreground">{t("footer.phone")}</span>
                <a href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-primary transition-colors">{siteConfig.contact.phone}</a>
              </li>
              <li className="flex flex-col pt-2">
                <span className="font-medium text-foreground">{t("footer.office")}</span>
                <span>{siteConfig.contact.address.line1}</span>
                <span>{siteConfig.contact.address.line2}</span>
              </li>
              <li className="flex flex-col pt-2">
                <span className="font-medium text-foreground text-xs uppercase tracking-widest text-primary/80">{t("footer.serviceAreas")}</span>
                <span className="text-xs">{siteConfig.contact.serviceAreas.join(", ")}</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {t("footer.copyright")}</p>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">{t("footer.privacyPolicy")}</Link>
            <Link href="/terms-conditions" className="hover:text-primary transition-colors">{t("footer.termsOfService")}</Link>
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">{t("footer.cookiePolicy")}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
