/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker"
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist"
import { Serwist, NetworkOnly } from "serwist"

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document"
        },
      },
    ],
  },
  runtimeCaching: [
    // Do NOT cache specific secure/dynamic routes
    {
      matcher: ({ url }) => {
        const path = url.pathname;
        return (
          path.startsWith('/admin') ||
          path.startsWith('/api/auth') ||
          path.startsWith('/checkout') ||
          path.startsWith('/account') ||
          path.startsWith('/orders') ||
          path.startsWith('/bookings')
        );
      },
      handler: new NetworkOnly(),
    },
    // Apply Next.js default caching strategies (handles images, fonts, static assets, etc)
    ...defaultCache,
  ],
})

serwist.addEventListeners()
