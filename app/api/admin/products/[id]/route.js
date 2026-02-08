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

const validateUrl = (url) => {
  if (!url || typeof url !== "string") return null
  const sanitized = sanitizeInput(url, 2000)
  if (!sanitized.match(/^https?:\/\//i)) return null
  if (sanitized.match(/^javascript:/i)) return null
  return sanitized
}

const validateHexColor = (color) => {
  if (!color || typeof color !== "string") return null
  const sanitized = sanitizeInput(color, 7)
  if (!sanitized.match(/^#[0-9A-Fa-f]{6}$/)) return null
  return sanitized
}

export async function GET(_request, { params }) {
  const resolvedParams = await params
  const id = Number(resolvedParams?.id)
  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ ok: false, error: "id_required" }, { status: 400 })
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      specs: { orderBy: { sortOrder: "asc" } },
      tags: { include: { tag: true } },
      infoBoxes: { orderBy: { sortOrder: "asc" } },
      features: { orderBy: { sortOrder: "asc" } },
      colors: { include: { color: true } },
    },
  })

  if (!product) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 })
  }

  return NextResponse.json({ ok: true, product })
}

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params
    const id = Number(resolvedParams?.id)
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ ok: false, error: "id_required" }, { status: 400 })
    }

    const body = await request.json().catch(() => null)
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 })
    }

    const titleRaw = sanitizeInput(body.title, 200)
    const slugRaw = sanitizeInput(body.slug, 200)
    const skuRaw = body.sku ? sanitizeInput(String(body.sku), 100) : null

    const title = escapeHtml(titleRaw)
    const slug = escapeHtml(slugRaw)
    const sku = skuRaw ? escapeHtml(skuRaw) : null

    if (!title || !slug) {
      return NextResponse.json({ ok: false, error: "title_slug_required" }, { status: 400 })
    }

    const images = Array.isArray(body?.images) ? body.images.slice(0, 50) : []
    const specs = Array.isArray(body?.specs) ? body.specs.slice(0, 100) : []
    const tags = Array.isArray(body?.tags) ? body.tags.slice(0, 50) : []
    const infoBoxes = Array.isArray(body?.infoBoxes) ? body.infoBoxes.slice(0, 20) : []
    const features = Array.isArray(body?.features) ? body.features.slice(0, 20) : []
    const colorIds = Array.isArray(body?.colorIds) ? body.colorIds.slice(0, 50) : []

    const product = await prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id },
        data: {
          title,
          slug,
          sku: sku || null,
          description: body.description ? escapeHtml(sanitizeInput(String(body.description), 50000)) : null,
          videoUrl: validateUrl(body.videoUrl),
          categoryId: validateId(body.categoryId),
          published: Boolean(body.published),
          priceMin: String(body.priceMin || "0.01").slice(0, 20),
          priceMax: String(body.priceMax || "0.01").slice(0, 20),
          imageMain: validateUrl(body.imageMain),
          imageAlt: body.imageAlt ? escapeHtml(sanitizeInput(String(body.imageAlt), 500)) : null,
          // SEO Fields
          seoTitle: body.seoTitle ? escapeHtml(sanitizeInput(String(body.seoTitle), 500)) : null,
          seoDescription: body.seoDescription ? escapeHtml(sanitizeInput(String(body.seoDescription), 5000)) : null,
          seoKeywords: body.seoKeywords ? escapeHtml(sanitizeInput(String(body.seoKeywords), 2000)) : null,
          canonicalUrl: validateUrl(body.canonicalUrl),
          ogImage: validateUrl(body.ogImage),
          noIndex: Boolean(body.noIndex),
        },
      })

      await tx.productImage.deleteMany({ where: { productId: id } })
      await tx.productSpec.deleteMany({ where: { productId: id } })
      await tx.productTag.deleteMany({ where: { productId: id } })
      await tx.productInfoBox.deleteMany({ where: { productId: id } })
      await tx.productFeature.deleteMany({ where: { productId: id } })
      await tx.productColor.deleteMany({ where: { productId: id } })

      const finalColorIds = colorIds
        .map((c) => validateId(c))
        .filter((c) => c !== null)

      if (finalColorIds.length) {
        await tx.productColor.createMany({
          data: finalColorIds.map((colorId) => ({ productId: id, colorId })),
          skipDuplicates: true,
        })
      }

      if (images.length) {
        await tx.productImage.createMany({
          data: images
            .filter((i) => i && validateUrl(i.url))
            .map((i) => ({
              productId: id,
              url: validateUrl(i.url),
              alt: i.alt ? escapeHtml(sanitizeInput(String(i.alt), 500)) : null,
              sortOrder: Math.max(0, Math.min(9999, Number(i.sortOrder || 0))),
            })),
        })
      }

      if (features.length) {
        await tx.productFeature.createMany({
          data: features
            .map((f, idx) => ({
              productId: id,
              imageUrl: validateUrl(f.imageUrl) || "",
              title: escapeHtml(sanitizeInput(String(f.title || ""), 200)) || "",
              subtitle: f.subtitle ? escapeHtml(sanitizeInput(String(f.subtitle), 500)) : null,
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
              productId: id,
              iconUrl: validateUrl(b.iconUrl) || "/assets/img/icon/product-det-1.png",
              title: escapeHtml(sanitizeInput(String(b.title || ""), 200)) || "",
              subtitle: b.subtitle ? escapeHtml(sanitizeInput(String(b.subtitle), 500)) : null,
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
            .map((s) => ({
              productId: id,
              key: escapeHtml(sanitizeInput(String(s.key), 200)),
              value: escapeHtml(sanitizeInput(String(s.value), 500)),
              sortOrder: Math.max(0, Math.min(9999, Number(s.sortOrder || 0))),
            })),
        })
      }

      const tagStrings = tags
        .map((t) => (typeof t === "string" ? t : t?.name || t?.slug))
        .map((t) => sanitizeInput(String(t || ""), 100))
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
            data: tagIds.map((tagId) => ({ productId: id, tagId })),
            skipDuplicates: true,
          })
        }
      }

      return updated
    })

    const full = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        specs: { orderBy: { sortOrder: "asc" } },
        tags: { include: { tag: true } },
        infoBoxes: { orderBy: { sortOrder: "asc" } },
        features: { orderBy: { sortOrder: "asc" } },
        colors: { include: { color: true } },
      },
    })

    return NextResponse.json({ ok: true, product: full || product })
  } catch (e) {
    const message = e && typeof e === "object" && "message" in e ? String(e.message) : "update_failed"
    const stack = e && typeof e === "object" && "stack" in e ? String(e.stack) : null
    return NextResponse.json(
      { ok: false, error: message, stack: process.env.NODE_ENV !== "production" ? stack : null },
      { status: 500 }
    )
  }
}

export async function DELETE(_request, { params }) {
  try {
    const resolvedParams = await params
    const id = Number(resolvedParams?.id)
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ ok: false, error: "id_required" }, { status: 400 })
    }

    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: "delete_failed" }, { status: 500 })
  }
}
