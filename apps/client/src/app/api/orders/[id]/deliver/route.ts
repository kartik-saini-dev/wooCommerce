import { NextResponse, NextRequest } from "next/server"
import { prisma as db } from "@repo/db"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: orderId } = await params
  
  try {
    const updated = await db.order.update({
      where: { id: orderId },
      data: { status: "DELIVERED" }
    })
    
    return NextResponse.json({ success: true, orderId })
  } catch (error) {
    console.error("Order delivery update error:", error)
    return NextResponse.json({ success: false, error: "Failed to update order status" }, { status: 500 })
  }
}
