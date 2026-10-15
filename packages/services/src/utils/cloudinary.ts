import crypto from "crypto";

export async function deleteCloudinaryImage(url: string) {
  try {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return false;
    
    let filePart = parts.slice(uploadIndex + 1).join("/");
    if (filePart.match(/^v\d+\//)) {
      filePart = filePart.replace(/^v\d+\//, "");
    }
    
    const publicId = filePart.replace(/\.[^/.]+$/, "");
    if (!publicId) return false;

    const cloudName = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "pjrxuzwl").trim();
    const apiKey = (process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "712423838634247").trim();
    const apiSecret = (process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || "RW10jyicGTdIFWm9jPBIHh1PJ-0").trim();

    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    const str = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(str).digest("hex");

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.result === "ok";
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return false;
  }
}
