import { v2 as cloudinary } from "cloudinary"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@repo/services/auth"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    // Only Admins can upload images to our Cloudinary
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { paramsToSign } = body

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET as string
    )

    return NextResponse.json({ signature })
  } catch (error: any) {
    console.error("Error generating signature stack:", error.stack || error)
    return NextResponse.json(
      { error: "Failed to generate signature" },
      { status: 500 }
    )
  }
}
