"use client"

import { Button } from "@repo/ui/components/ui/button"
import { FileText } from "lucide-react"

export function PrintInvoiceButton() {
  return (
    <Button variant="outline" className="w-full" onClick={() => window.print()}>
      <FileText className="mr-2 h-4 w-4" /> Print Invoice
    </Button>
  )
}
