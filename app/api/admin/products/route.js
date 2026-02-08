import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { sanitizeInput, validateId, escapeHtml } from "@/lib/security"

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

// Validate and sanitize URL
const validateUrl = (url) => {
  if (!url || typeof url !== 'string') return null
  const sanitized = sanitizeInput(url, 2000)
  // Only allow http/https URLs
  if (!sanitized.match(/^https?:\/\//i)) return null
  // Prevent javascript: protocol
  if (sanitized.match(/^javascript:/i)) return null
  return sanitized
}

// Validate hex color
const validateHexColor = (color) => {
  if (!color || typeof color !== 'string') return null
  const sanitized = sanitizeInput(color, 7)
  if (!sanitized.match(/^#[0-9A-Fa-f]{6}$/)) return null
  return sanitized
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        specs: { orderBy: { sortOrder: "asc" } },
        tags: { include: { tag: true } },
        infoBoxes: { orderBy: { sortOrder: "asc" } },
        features: { orderBy: { sortOrder: "asc" } },
        colors: { include: { color: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    })
    return NextResponse.json({ ok: true, products })
  } catch {
    return NextResponse.json({ ok: false, error: "get_failed" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 })
    }

    const title = sanitizeInput(body.title, 200)
    const slug = sanitizeInput(body.slug, 200)

    if (!title || !slug || !slug.match(/^[a-z0-9_-]+$/)) {
      return NextResponse.json({ ok: false, error: "title_slug_required" }, { status: 400 })
    }

    const sku = body.sku ? sanitizeInput(body.sku, 100) : null

    // Validate arrays
    const images = Array.isArray(body?.images) ? body.images.slice(0, 50) : []
    const specs = Array.isArray(body?.specs) ? body.specs.slice(0, 100) : []
    const tags = Array.isArray(body?.tags) ? body.tags.slice(0, 50) : []
    const infoBoxes = Array.isArray(body?.infoBoxes) ? body.infoBoxes.slice(0, 20) : []
    const features = Array.isArray(body?.features) ? body.features.slice(0, 20) : []
    const colorIds = Array.isArray(body?.colorIds) ? body.colorIds.slice(0, 50) : []

    // Validate category ID
    const categoryId = validateId(body.categoryId)

    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          title: escapeHtml(title),
          slug: escapeHtml(slug),
          sku: sku ? escapeHtml(sku) : null,
          description: body.description ? escapeHtml(sanitizeInput(body.description, 50000)) : null,
          videoUrl: validateUrl(body.videoUrl),
          categoryId,
          published: Boolean(body.published),
          priceMin: String(body.priceMin || "0.01").slice(0, 20),
          priceMax: String(body.priceMax || "0.01").slice(0, 20),
          imageMain: validateUrl(body.imageMain),
          imageAlt: body.imageAlt ? escapeHtml(sanitizeInput(body.imageAlt, 500)) : null,
        },
      })

      const productId = created.id

      const finalColorIds = colorIds
        .map((c) => validateId(c))
        .filter((c) => c !== null)

      if (finalColorIds.length) {
        await tx.productColor.createMany({
          data: finalColorIds.map((colorId) => ({ productId, colorId })),
          skipDuplicates: true,
        })
      }

      if (images.length) {
        await tx.productImage.createMany({
          data: images
            .filter((i) => i && validateUrl(i.url))
            .map((i) => ({
              productId,
              url: validateUrl(i.url),
              alt: i.alt ? escapeHtml(sanitizeInput(i.alt, 500)) : null,
              sortOrder: Math.max(0, Math.min(9999, Number(i.sortOrder || 0))),
            })),
        })
      }

      if (features.length) {
        await tx.productFeature.createMany({
          data: features
            .map((f, idx) => ({
              productId,
              imageUrl: validateUrl(f.imageUrl) || "",
              title: escapeHtml(sanitizeInput(f.title, 200)) || "",
              subtitle: f.subtitle ? escapeHtml(sanitizeInput(f.subtitle, 500)) : null,
              isActive: f.isActive === false ? false : true,
              sortOrder: Math.max(0, Math.min(9999, Number(f.sortOrder ?? (idx + 1) * 10) || 0)),
            }))
            .filter((f) => f.title && f.imageUrl),
        })
      }

      if (infoBoxes.length) {
        await tx.productInfoBox.createMany({
          data: infoBoxes
            .map((b, idx) => ({
              productId,
              iconUrl: validateUrl(b.iconUrl) || "/assets/img/icon/product-det-1.png",
              title: escapeHtml(sanitizeInput(b.title, 200)) || "",
              subtitle: b.subtitle ? escapeHtml(sanitizeInput(b.subtitle, 500)) : null,
              color: validateHexColor(b.color),
              isActive: b.isActive === false ? false : true,
              sortOrder: Math.max(0, Math.min(9999, Number(b.sortOrder ?? idx * 10) || 0)),
            }))
            .filter((b) => b.title),
        })
      }

      if (specs.length) {
        await tx.productSpec.createMany({
          data: specs
            .filter((s) => s && s.key && s.value)
            .slice(0, 100)
            .map((s) => ({
              productId,
              key: escapeHtml(sanitizeInput(s.key, 200)),
              value: escapeHtml(sanitizeInput(s.value, 500)),
              sortOrder: Math.max(0, Math.min(9999, Number(s.sortOrder || 0))),
            })),
        })
      }

      const tagStrings = tags
        .map((t) => (typeof t === "string" ? t : t?.name || t?.slug))
        .map((t) => sanitizeInput(t, 100))
        .filter(Boolean)

      if (tagStrings.length) {
        const uniqueTagIds = new Set()
        for (const t of tagStrings.slice(0, 50)) {
          const s = slugify(t)
          if (!s || s.length > 100) continue
          const tag = await tx.tag.upsert({
            where: { slug: s },
            update: { name: t.slice(0, 100) },
            create: { name: t.slice(0, 100), slug: s },
          })
          uniqueTagIds.add(tag.id)
        }

        const tagIds = Array.from(uniqueTagIds)
        if (tagIds.length) {
          await tx.productTag.createMany({
            data: tagIds.map((tagId) => ({ productId, tagId })),
            skipDuplicates: true,
          })
        }
      }

      return created
    })

    return NextResponse.json({ ok: true, product })
  } catch (err) {
    console.error("Product creation error:", err)
    return NextResponse.json({ ok: false, error: "create_failed" }, { status: 500 })
  }
}
