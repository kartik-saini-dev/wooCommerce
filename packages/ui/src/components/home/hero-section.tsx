"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Wrench, Zap } from "lucide-react"

import { buttonVariants } from "@repo/ui/components/ui/button"
import { Container } from "@repo/ui/components/ui/container"
import { Section } from "@repo/ui/components/ui/section"
import { useTranslation } from "@repo/services/i18n/LanguageContext"
import { cn } from "@repo/services/utils"

export function HeroSection() {
  const { t } = useTranslation()
  return (
    <Section className="relative overflow-hidden bg-background pt-20 md:pt-28 pb-14 md:pb-20 lg:pb-28">
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b border-slate-100/5 pointer-events-none" />
      <Container className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto flex max-w-4xl flex-col items-center gap-6"
        >
          <div className="inline-flex items-center rounded-full border border-border/80 bg-muted/60 px-3.5 py-1 text-xs sm:text-sm font-medium shadow-xs">
            <Zap className="mr-2 h-4 w-4 text-primary fill-primary/20" />
            <span className="text-muted-foreground">{t("hero.trusted") || "Your most trusted shopping destination"}</span>
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {t("hero.titleParts") || "Premium Products &"} <br className="hidden sm:block" />
            <span className="text-primary">{t("hero.titleRepairs") || "Professional Services"}</span>
          </h1>
          
          <p className="max-w-2xl text-base sm:text-lg text-muted-foreground sm:text-xl leading-relaxed px-4">
            {t("hero.subtitle") || "We provide top-tier genuine products and certified professionals for all your needs."}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4">
            <Link
              href="/products"
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full sm:w-auto h-11 px-6 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all gap-2"
              )}
            >
              {t("hero.shopNow") || "Shop Products"}
              <Wrench className="h-4 w-4" />
            </Link>
            
            <Link
              href="/services"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-auto h-11 px-6 rounded-xl font-semibold border-border hover:bg-muted/80 backdrop-blur-sm transition-all gap-2"
              )}
            >
              {t("hero.bookRepair") || "Book a Service"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}
