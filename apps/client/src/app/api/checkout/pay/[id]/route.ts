// File: apps/client/src/app/api/checkout/pay/[id]/route.ts
import { NextResponse, NextRequest } from "next/server"
import { prisma as db } from "@repo/db"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: orderId } = await params
  try {
    // Update order status to PROCESSING (simulated successful payment)
    const updated = await db.order.update({
      where: { id: orderId },
      data: { status: "PROCESSING" }
    })
    return NextResponse.json({ success: true, orderId })
  } catch (error) {
    console.error("Payment update error:", error)
    return NextResponse.json({ success: false, error: "Failed to update order status" }, { status: 500 })
  }
}
