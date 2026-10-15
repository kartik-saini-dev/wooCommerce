import { Metadata } from "next"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { ContactForm } from "@repo/ui/components/contact/contact-form"
import { getTranslation } from "@repo/services/i18n/server"
import { siteConfig } from "@repo/ui/config/site"

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${siteConfig.name} for any inquiries or support.`,
}

export default async function ContactPage() {
  const { t } = await getTranslation()
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{t("contact.title")}</h1>
          <p className="text-lg text-muted-foreground">
            {t("contact.description")}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left Column - Contact Info & Map */}
          <div className="space-y-8 flex flex-col">
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2 p-6 bg-muted/30 rounded-xl border">
                <MapPin className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-semibold text-lg">Office Address</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {siteConfig.contact.address.line1}<br />
                  {siteConfig.contact.address.line2}<br />
                </p>
              </div>

              <div className="flex flex-col space-y-2 p-6 bg-muted/30 rounded-xl border">
                <Clock className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-semibold text-lg">Business Hours</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {siteConfig.contact.workingHours}
                </p>
              </div>

              <div className="flex flex-col space-y-2 p-6 bg-muted/30 rounded-xl border">
                <Phone className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-semibold text-lg">Call Us</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Support: {siteConfig.contact.phone}
                </p>
              </div>

              <div className="flex flex-col space-y-2 p-6 bg-muted/30 rounded-xl border">
                <Mail className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-semibold text-lg">Email Us</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Support: {siteConfig.contact.email}
                </p>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="w-full h-[300px] lg:h-full min-h-[300px] rounded-xl overflow-hidden border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109315.6577884814!2d76.4385!3d30.9664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3905543c7b396ab9%3A0x6b09569562da7e5!2sRupnagar%2C%20Punjab!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${siteConfig.name} Office Location`}
              />
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="h-full">
            <ContactForm />
          </div>
          
        </div>
      </div>
    </div>
  )
}
