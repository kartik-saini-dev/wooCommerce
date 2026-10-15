import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@repo/services/auth";
import { prisma as db } from "@repo/db";

// In-memory store for driver locations.
// For a production app with multiple instances, use Redis.
const globalForTracking = global as unknown as { driverLocations: Record<string, { lat: number, lng: number, updatedAt: Date }> };
const driverLocations = globalForTracking.driverLocations || {};
if (process.env.NODE_ENV !== "production") globalForTracking.driverLocations = driverLocations;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    // In a real app, verify user is a DRIVER
    const body = await req.json();
    const { driverId, lat, lng } = body;

    if (!driverId || !lat || !lng) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Ensure the caller is the driver or admin
    if (session.user.id !== driverId && session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    driverLocations[driverId] = { lat, lng, updatedAt: new Date() };

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
      select: { userId: true, deliveryDriverId: true, status: true, deliveryMethod: true }
    });

    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Validate ownership
    if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (order.deliveryMethod !== "HOME_DELIVERY" || order.status !== "SHIPPED") {
       return NextResponse.json({ error: "Tracking not active" }, { status: 400 });
    }

    if (!order.deliveryDriverId) {
      return NextResponse.json({ error: "Driver not assigned" }, { status: 400 });
    }

    const loc = driverLocations[order.deliveryDriverId];
    if (!loc) {
       return NextResponse.json({ status: "waiting_for_driver" });
    }

    return NextResponse.json({ status: "tracking", location: loc });
  } catch (e) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
