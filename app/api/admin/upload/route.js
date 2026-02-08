import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

export const runtime = "nodejs"

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024
const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"])
const ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"])

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

const safeExt = (name) => {
  const ext = (name || "").split(".").pop()?.toLowerCase()
  if (!ext) return "bin"
  if (!/^[a-z0-9]+$/.test(ext)) return "bin"
  return ext
}

export async function POST(request) {
  try {
    // Cloudinary yapılandırma kontrolü
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ ok: false, error: "cloudinary_not_configured" }, { status: 500 })
    }

    const form = await request.formData()
    const file = form.get("file")

    if (!file || typeof file === "string") {
      return NextResponse.json({ ok: false, error: "file_required" }, { status: 400 })
    }

    const mime = typeof file.type === "string" ? file.type : ""
    const ext = safeExt(file.name)

    if (!ALLOWED_EXTENSIONS.has(`.${ext}`) || !ALLOWED_MIME_TYPES.has(mime)) {
      return NextResponse.json({ ok: false, error: "invalid_file_type" }, { status: 400 })
    }

    const size = typeof file.size === "number" ? file.size : null
    if (size !== null && size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ ok: false, error: "file_too_large" }, { status: 413 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    if (buffer.length > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ ok: false, error: "file_too_large" }, { status: 413 })
    }

    // Buffer'ı base64'e çevir
    const base64String = `data:${mime};base64,${buffer.toString("base64")}`

    // Cloudinary'a yükle
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        base64String,
        {
          folder: "royal-uploads",
          public_id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
    })

    return NextResponse.json({ 
      ok: true, 
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id 
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ ok: false, error: "upload_failed" }, { status: 500 })
  }
}
