"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/components/ui/breadcrumb"

export function AdminBreadcrumbs() {
  const pathname = usePathname()
  
  // Split path into segments
  const segments = pathname.split('/').filter(Boolean)
  
  // Only show if we are in admin
  if (segments[0] !== 'admin') return null

  // Skip the 'admin' segment in display, or keep it as root
  const breadcrumbItems = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`
    // Check if segment looks like a UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)
    
    let label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
    
    if (isUUID) {
      label = "Details"
    }
    
    return { href, label }
  })

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1
          
          return (
            <div key={item.href} className="flex items-center gap-1.5 sm:gap-2.5">
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href}>
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
