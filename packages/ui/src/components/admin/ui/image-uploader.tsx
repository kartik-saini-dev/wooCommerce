"use client"

import * as React from "react"
import { CldUploadWidget } from "next-cloudinary"
import { ImagePlus, Trash, X } from "lucide-react"
import Image from "next/image"

import { Button } from "@repo/ui/components/ui/button"

interface ImageUploaderProps {
  value: string[]
  onChange: (urls: string[]) => void
  onRemove: (url: string) => void
  maxFiles?: number
}

export function ImageUploader({
  value,
  onChange,
  onRemove,
  maxFiles = 5
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    const newUrls: string[] = []

    try {
      const cloudName = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "pjrxuzwl").trim()
      const uploadPreset = (process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "getfp85r").trim()

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", uploadPreset)

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          throw new Error("Failed to upload image")
        }

        const data = await res.json()
        newUrls.push(data.secure_url)
      }

      onChange([...value, ...newUrls])
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
      if (inputRef.current) {
        inputRef.current.value = "" // Reset input
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden border">
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
                className="h-7 w-7"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Image Preview"
              src={url}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
      {value.length < maxFiles && (
        <>
          <input
            type="file"
            ref={inputRef}
            onChange={handleUpload}
            accept="image/jpeg, image/png, image/webp"
            multiple
            className="hidden"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-2 h-32 border-dashed border-2 bg-muted/50 hover:bg-muted"
          >
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
            <span className="text-muted-foreground font-medium">
              {isUploading ? "Uploading..." : "Click to upload images"}
            </span>
          </Button>
        </>
      )}
    </div>
  )
}
