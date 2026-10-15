import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { adminAuthOptions } from "@/lib/auth";
import { checkActionRateLimit } from "@repo/services/action-rate-limit";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(adminAuthOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Rate Limit: Max 50 uploads per hour per admin
    const isAllowed = checkActionRateLimit(session.user.id, "admin_image_upload", 50, 3600000);
    if (!isAllowed) {
      return NextResponse.json({ error: "Too many upload attempts. Please try again later." }, { status: 429 });
    }

    const formData = await request.formData();
    const cloudName = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "pjrxuzwl").trim();
    
    // Forward the exact FormData received from the client directly to Cloudinary.
    const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });
    
    const data = await cloudinaryResponse.json();
    
    if (!cloudinaryResponse.ok) {
      console.error("Cloudinary error:", data);
      return NextResponse.json({ error: "Cloudinary upload failed" }, { status: cloudinaryResponse.status });
    }
    
    return NextResponse.json({ secure_url: data.secure_url });
  } catch (error) {
    console.error("Server upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
