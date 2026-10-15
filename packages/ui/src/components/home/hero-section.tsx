"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Wrench, Zap } from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import { Container } from "@repo/ui/components/ui/container"
import { Section } from "@repo/ui/components/ui/section"
import { useTranslation } from "@repo/services/i18n/LanguageContext"

export function HeroSection() {
  const { t } = useTranslation()
  return (
    <Section className="relative overflow-hidden bg-background pt-24 md:pt-32 pb-16 md:pb-24 lg:pb-32">
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b border-slate-100/5" />
      <Container className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto flex max-w-4xl flex-col items-center gap-6"
        >
          <div className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium">
            <Zap className="mr-2 h-4 w-4 text-primary" />
            <span className="text-muted-foreground">{t("hero.trusted") || "The most trusted platform in your area"}</span>
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {t("hero.titleParts") || "Premium Spare Parts &"} <br className="hidden md:block" />
            <span className="text-primary">{t("hero.titleRepairs") || "Professional Repairs"}</span>
          </h1>
          
          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
            {t("hero.subtitle") || "We provide top-tier genuine products and certified professionals for all your needs."}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products" className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none bg-primary text-primary-foreground hover:bg-primary/80 h-9 px-4 gap-2">
              {t("hero.shopNow") || "Shop Spare Parts"}
              <Wrench className="h-4 w-4" />
            </Link>
            
            <Link href="/services" className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border bg-background text-foreground hover:bg-muted h-9 px-4 gap-2 bg-background/50 backdrop-blur-sm hover:bg-background/80">
              {t("hero.bookRepair") || "Book a Repair Service"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}
