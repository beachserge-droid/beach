import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

const mapProduct = (p) => ({
  id: p.id,
  slug: p.slug,
  sku: p.sku,
  title: p.title,
  imageMain: p.imageMain,
  imageAlt: p.imageAlt,
  images: p.images?.map((img) => img.url) || [],
  price: {
    min: Number(p.priceMin ?? 0.01),
    max: Number(p.priceMax ?? 0.01),
  },
  category: p.category ? [{ type: p.category.name, slug: p.category.slug }] : [],
  color: Array.isArray(p.colors) ? p.colors.map((c) => ({ type: c.color?.name, slug: c.color?.slug, hex: c.color?.hex })) : [],
  brand: [],
  published: p.published,
})

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { published: true },
      include: { 
        category: true, 
        colors: { include: { color: true } },
        images: { orderBy: { sortOrder: "asc" } }
      },
      orderBy: { createdAt: "desc" },
      take: 500,
    })

    return NextResponse.json({ ok: true, products: products.map(mapProduct) })
  } catch {
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 })
  }
}
