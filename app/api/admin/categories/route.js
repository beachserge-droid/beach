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

const normalizeSlugBase = (base) => {
  const s = String(base || "").trim()
  if (!s) return "category"
  if (/^[0-9]+$/.test(s)) return `cat-${s}`
  return s
}

const ensureUniqueSlug = async (baseSlug) => {
  const rawBase = String(baseSlug || "").trim()
  const cleanBase = rawBase || "category"

  let candidate = cleanBase
  let n = 2

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const exists = await prisma.category.findUnique({ where: { slug: candidate } })
    if (!exists) return candidate
    candidate = `${cleanBase}-${n}`
    n += 1
    if (n > 50) return `${cleanBase}-${Date.now()}`
  }
}

const parseBody = async (request) => {
  const contentType = request.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    const json = await request.json()
    return {
      name: json.name,
      slug: json.slug,
      parentId: json.parentId,
      iconImage: json.iconImage,
      sortOrder: json.sortOrder,
    }
  }

  const form = await request.formData()
  return {
    name: form.get("name"),
    slug: form.get("slug"),
    parentId: form.get("parentId"),
    iconImage: form.get("iconImage"),
    sortOrder: form.get("sortOrder"),
  }
}

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  })
  return NextResponse.json({ ok: true, categories })
}

export async function POST(request) {
  try {
    const { name, slug, parentId, iconImage, sortOrder } = await parseBody(request)

    const finalName = String(name || "").trim()
    const finalSlugRaw = slug != null ? String(slug).trim() : ""

    const slugFromName = slugify(finalName)
    const isNumericSlug = /^[0-9]+$/.test(finalSlugRaw)
    const baseSlug = finalSlugRaw && !isNumericSlug ? slugify(finalSlugRaw) : slugFromName
    const finalSlug = await ensureUniqueSlug(normalizeSlugBase(baseSlug))

    if (!finalName || !finalSlug) {
      return NextResponse.json({ ok: false, error: "name_slug_required" }, { status: 400 })
    }

    const parentIdNum = parentId ? Number(parentId) : null
    const sortOrderNum = sortOrder != null && String(sortOrder).length ? Number(sortOrder) : 0
    const iconImageStr = iconImage ? String(iconImage) : null

    const category = await prisma.category.create({
      data: {
        name: finalName,
        slug: finalSlug,
        parentId: parentIdNum && !Number.isNaN(parentIdNum) ? parentIdNum : null,
        iconImage: iconImageStr,
        sortOrder: !Number.isNaN(sortOrderNum) ? sortOrderNum : 0,
      },
    })

    return NextResponse.json({ ok: true, category })
  } catch {
    return NextResponse.json({ ok: false, error: "create_failed" }, { status: 500 })
  }
}
