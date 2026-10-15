import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "@repo/ui/config/site";
import "./globals.css";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@repo/services/auth";
import { CartRepository } from "@repo/services/repositories/cart";
import { WishlistRepository } from "@repo/services/repositories/wishlist";
import { Toaster } from "@repo/ui/components/ui/sonner";

import { ThemeProvider } from "@repo/ui/components/theme-provider";
import { TooltipProvider } from "@repo/ui/components/ui/tooltip";
import { CommunicationWidgets } from "@repo/ui/components/ui/communication-widgets";
import { CartProvider } from "@repo/ui/components/shop/cart-provider";
import { InstallPrompt } from "@repo/ui/components/pwa/install-prompt";
import { LanguageProvider } from "@repo/services/i18n/LanguageContext";
import { getTranslation } from "@repo/services/i18n/server";
import { Navbar } from "@repo/ui/components/layout/navbar";
import { Footer } from "@repo/ui/components/layout/footer";
import { ConditionalLayout } from "@repo/ui/components/layout/conditional-layout";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  minimumScale: 1,
  initialScale: 1,
  width: 'device-width',
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    template: siteConfig.seo.titleTemplate,
    default: siteConfig.seo.defaultTitle,
  },
  description: siteConfig.description,
  keywords: siteConfig.seo.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [siteConfig.seo.defaultImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.description,
    images: [siteConfig.seo.defaultImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.shortName,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (err) {
    console.error('Session retrieval error:', err);
    // If decryption fails, treat as unauthenticated
    session = null;
  }
  const { locale } = await getTranslation();
  let cart = null;
  let wishlistCount = 0;

  if (session?.user) {
    try {
      // Fetch in parallel to avoid sequential blocking
      const [fetchedCart, fetchedWishlist] = await Promise.all([
        CartRepository.getCart(session.user.id),
        WishlistRepository.getWishlist(session.user.id)
      ]);
      const serializedCart = fetchedCart ? {
        ...fetchedCart,
        items: fetchedCart.items.map(item => ({
          ...item,
          product: {
            ...item.product,
            price: Number(item.product.price),
            comparePrice: item.product.comparePrice ? Number(item.product.comparePrice) : null,
            discount: item.product.discount ? Number(item.product.discount) : null,
          }
        }))
      } : null;
      cart = serializedCart;
      wishlistCount = fetchedWishlist?.items?.length || 0;
    } catch (e) {
      console.error("Failed to load user cart/wishlist", e);
    }
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300`}>
        <CartProvider initialCart={cart}>
          <ThemeProvider
            attribute="data-theme"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <LanguageProvider initialLocale={locale}>
                <ConditionalLayout 
                  navbar={<Navbar wishlistCount={wishlistCount} userRole={session?.user?.role} />}
                  footer={<Footer />}
                >
                  {children}
                </ConditionalLayout>
              </LanguageProvider>
              <Toaster position="bottom-right" richColors />
              <CommunicationWidgets />
              <InstallPrompt />
            </TooltipProvider>
          </ThemeProvider>
        </CartProvider>
      </body>
    </html>
  );
}
