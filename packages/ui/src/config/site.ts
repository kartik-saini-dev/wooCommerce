import { SiteConfig } from "./types"

export const siteConfig: SiteConfig = {
  name: "StoreName",
  adminName: "StoreAdmin",
  shortName: "Store",
  description: "Your trusted source for professional services and authentic products.",
  url: "https://example.com",
  links: {
    twitter: "https://twitter.com/example",
    github: "https://github.com/example",
  },
  seo: {
    titleTemplate: "%s | StoreName",
    defaultTitle: "StoreName - Services & Store",
    keywords: ["store", "services", "products", "ecommerce"],
    defaultImage: "/images/og-image.jpg"
  },
  contact: {
    email: "support@example.com",
    phone: "+1 234 567 8900",
    address: {
      line1: "123 Business Avenue",
      line2: "City, State 12345",
    },
    serviceAreas: ["City A", "City B", "City C"],
    workingHours: "Mon-Sat: 9AM - 8PM\nSunday: Closed",
  },
  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "",
  },
  payment: {
    methods: ["COD", "UPI"],
    currency: "INR",
  },
  tax: {
    rate: 0.18,
  }
}
