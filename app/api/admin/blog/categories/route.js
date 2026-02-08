import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

const slugify = (value) =>
  (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")

const ensureUniqueSlug = async (baseSlug) => {
  const rawBase = String(baseSlug || "").trim()
  const cleanBase = rawBase || "category"

  let candidate = cleanBase
  let n = 2

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const exists = await prisma.blogCategory.findUnique({ where: { slug: candidate } })
    if (!exists) return candidate
    candidate = `${cleanBase}-${n}`
    n += 1
    if (n > 50) return `${cleanBase}-${Date.now()}`
  }
}

export async function GET() {
  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      take: 2000,
    })
    return NextResponse.json({ ok: true, categories })
  } catch {
    return NextResponse.json({ ok: false, error: "get_failed" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))

    const name = body.name != null ? String(body.name).trim() : ""
    if (!name) {
      return NextResponse.json({ ok: false, error: "name_required" }, { status: 400 })
    }

    const slugRaw = body.slug != null ? String(body.slug).trim() : ""
    const baseSlug = slugify(slugRaw || name)
    const slug = await ensureUniqueSlug(baseSlug)

    const sortOrder = body.sortOrder != null ? Number(body.sortOrder) : 0
    const isActive = body.isActive === false ? false : true

    const category = await prisma.blogCategory.create({
      data: {
        name,
        slug,
        sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
        isActive,
      },
    })

    return NextResponse.json({ ok: true, category })
  } catch {
    return NextResponse.json({ ok: false, error: "create_failed" }, { status: 500 })
  }
}
