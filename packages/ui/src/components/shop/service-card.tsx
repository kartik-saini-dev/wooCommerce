"use client"

import Link from "next/link"
import Image from "next/image"
import { Service, ServiceImage, ServiceCategory } from "@prisma/client"
import { ArrowRight, Clock, MapPin } from "lucide-react"

import { buttonVariants } from "@repo/ui/components/ui/button"
import { cn } from "@repo/services/utils"
import { useTranslation } from "@repo/services/i18n/LanguageContext"

type ServiceWithRelations = Service & {
  images: ServiceImage[]
  category?: ServiceCategory
}

interface ServiceCardProps {
  service: ServiceWithRelations
  className?: string
}

export function ServiceCard({ service, className }: ServiceCardProps) {
  const { t } = useTranslation()
  const primaryImage = service.images.find(img => img.isPrimary) || service.images[0]
  
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(service.basePrice))

  return (
    <div className={cn(
      "group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 dark:border-border/40 dark:bg-card/40 dark:backdrop-blur-xl dark:hover:border-primary/40 dark:hover:bg-card/60", 
      className
    )}>
      <Link href={`/services/${service.slug}`} className="relative aspect-[16/9] w-full overflow-hidden bg-muted/50 dark:bg-muted/10">
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {service.isEmergency && (
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {t("shop.emergencyAvailable")}
            </div>
          )}
        </div>
        
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText || service.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-multiply dark:mix-blend-normal"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted/50">
            <span className="text-muted-foreground font-medium text-sm">No image</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {service.category && (
          <div className="text-sm font-medium hover:underline text-primary hidden group-hover:block transition-all">
            {t("shop.details")}
          </div>
        )}
        
        <h3 className="mb-2 text-xl font-bold leading-tight group-hover:text-primary transition-colors">
          <Link href={`/services/${service.slug}`}>
            {service.name}
          </Link>
        </h3>
        
        {service.shortDescription && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {service.shortDescription}
          </p>
        )}

        <div className="mt-auto space-y-4">
          <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground">
            {service.estimatedHrs && (
              <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1 border border-border/50">
                <Clock className="w-3 h-3" />
                {service.estimatedHrs} {t("shop.hrs")}
              </span>
            )}
            {service.isHomeVisit && (
              <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1 border border-border/50">
                <MapPin className="w-3 h-3" />
                {t("shop.homeVisit")}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Starting from</span>
              <span className="text-lg font-bold text-foreground">{formattedPrice}</span>
            </div>
            
            <Link 
              href={`/services/${service.slug}`} 
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "group/btn rounded-full")}
            >
              Details
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
