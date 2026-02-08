import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET(_request, { params }) {
  try {
    const resolvedParams = await params
    const slug = resolvedParams?.slug ? String(resolvedParams.slug) : ""
    if (!slug) {
      return NextResponse.json({ ok: false, error: "slug_required" }, { status: 400 })
    }

    const numericId = /^[0-9]+$/.test(slug) ? Number(slug) : null
    const product = await prisma.product.findUnique({
      where: numericId ? { id: numericId } : { slug },
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

    return NextResponse.json({
      ok: true,
      product: {
        id: product.id,
        title: product.title,
        slug: product.slug,
        sku: product.sku,
        description: product.description,
        videoUrl: product.videoUrl,
        priceMin: product.priceMin.toString(),
        priceMax: product.priceMax.toString(),
        imageMain: product.imageMain,
        imageAlt: product.imageAlt,
        images: product.images,
        specs: product.specs,
        infoBoxes: product.infoBoxes,
        features: product.features,
        colors: Array.isArray(product.colors) ? product.colors.map((c) => ({ id: c.color?.id, name: c.color?.name, slug: c.color?.slug, hex: c.color?.hex })) : [],
        tags: product.tags.map((t) => ({ id: t.tag.id, name: t.tag.name, slug: t.tag.slug })),
        category: product.category ? { id: product.category.id, name: product.category.name, slug: product.category.slug } : null,
        published: product.published,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    })
  } catch {
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 })
  }
}
