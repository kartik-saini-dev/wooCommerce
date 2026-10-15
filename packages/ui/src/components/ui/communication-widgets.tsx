"use client"

import Link from "next/link"
import { Phone, MessageCircle } from "lucide-react"

export function CommunicationWidgets() {
  const whatsappNumber = "+919876543210"
  const phoneNumber = "+919876543210"
  
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {/* Call Button */}
      <Link 
        href={`tel:${phoneNumber}`}
        className="flex items-center justify-center h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        aria-label="Call us"
      >
        <Phone className="h-6 w-6" />
      </Link>
      
      {/* WhatsApp Button */}
      <Link 
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#128C7E] transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </Link>
    </div>
  )
}
