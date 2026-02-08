import { NextResponse } from "next/server"
import { mkdir, writeFile } from "fs/promises"
import path from "path"

export const runtime = "nodejs"

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024
const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"])
const ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"])

const safeExt = (name) => {
  const ext = path.extname(name || "").toLowerCase()
  if (!ext) return ".bin"
  if (!/^[.][a-z0-9]+$/.test(ext)) return ".bin"
  return ext
}

export async function POST(request) {
  try {
    const form = await request.formData()
    const file = form.get("file")

    if (!file || typeof file === "string") {
      return NextResponse.json({ ok: false, error: "file_required" }, { status: 400 })
    }

    const mime = typeof file.type === "string" ? file.type : ""
    const ext = safeExt(file.name)

    if (!ALLOWED_EXTENSIONS.has(ext) || !ALLOWED_MIME_TYPES.has(mime)) {
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

    const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`

    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadsDir, { recursive: true })

    const filePath = path.join(uploadsDir, fileName)
    await writeFile(filePath, buffer)

    return NextResponse.json({ ok: true, url: `/uploads/${fileName}` })
  } catch {
    return NextResponse.json({ ok: false, error: "upload_failed" }, { status: 500 })
  }
}
