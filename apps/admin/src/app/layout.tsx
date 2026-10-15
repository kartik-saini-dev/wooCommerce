import "./globals.css"
import type { Metadata } from "next"
import { Toaster } from "@repo/ui/components/ui/sonner"

export const metadata: Metadata = {
  title: "Admin Dashboard",
}

import { ThemeProvider } from "@repo/ui/components/theme-provider"
import { LanguageProvider } from "@repo/services/i18n/LanguageContext"
import { getTranslation } from "@repo/services/i18n/server"

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale } = await getTranslation()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased transition-colors duration-300">
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider initialLocale={locale}>
            {children}
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

