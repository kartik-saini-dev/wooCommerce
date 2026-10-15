import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@repo/services/auth";
import { checkActionRateLimit } from "@repo/services/action-rate-limit";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate Limit: Max 10 uploads per hour per user
    const isAllowed = checkActionRateLimit(session.user.id, "image_upload", 10, 3600000);
    if (!isAllowed) {
      return NextResponse.json({ error: "Too many upload attempts. Please try again later." }, { status: 429 });
    }

    const formData = await request.formData();
    const cloudName = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "pjrxuzwl").trim();
    
    // We forward the exact FormData received from the client directly to Cloudinary.
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
