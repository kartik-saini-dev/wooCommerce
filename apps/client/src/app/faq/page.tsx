import { Metadata } from "next"
import { prisma as db } from "@repo/db"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/ui/accordion"

import { siteConfig } from "@repo/ui/config/site"

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: `Find answers to common questions about ${siteConfig.name}.`,
}

const FALLBACK_FAQS = [
  {
    id: "1",
    question: "Do you offer warranties on your parts?",
    answer: "Yes, all our genuine parts come with the standard manufacturer warranty. Warranty periods vary by brand and product type."
  },
  {
    id: "2",
    question: "How do I book a repair service?",
    answer: "You can book a repair service by navigating to our Services page, selecting the repair type, and choosing a suitable date and time for our technician to visit."
  },
  {
    id: "3",
    question: "Can I return a defective item?",
    answer: "Absolutely. If you receive a defective or damaged item, please contact us within 7 days of delivery to initiate a return or replacement as per our Return Policy."
  },
  {
    id: "4",
    question: "Are your technicians certified?",
    answer: "Yes, all our technicians undergo strict background checks and are certified professionals with years of experience in electrical installations and repairs."
  }
]

export default async function FAQPage() {
  let faqs: { id: string, question: string, answer: string }[] = []
  
  try {
    const dbFaqs = await db.fAQ.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    })
    
    if (dbFaqs.length > 0) {
      faqs = dbFaqs
    } else {
      faqs = FALLBACK_FAQS
    }
  } catch (error) {
    console.error("Failed to load FAQs from database:", error)
    faqs = FALLBACK_FAQS
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-8">Frequently Asked Questions</h1>
        
        <Accordion className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={`item-${faq.id}`}>
              <AccordionTrigger className="text-left text-base font-semibold">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
