import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

export async function POST() {
  try {
    const slugs = ["denemeurun", "sdsdf"]
    const titles = ["deneme", "sdfsdf"]

    const result = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: {
          OR: [
            { slug: { in: slugs } },
            { title: { in: titles } },
          ],
        },
        select: { id: true },
        take: 200,
      })

      const productIds = products.map((p) => p.id)
      if (!productIds.length) {
        return {
          productIds: [],
          deletedImages: 0,
          deletedSpecs: 0,
          deletedTags: 0,
          deletedProducts: 0,
        }
      }

      const [images, specs, tags] = await Promise.all([
        tx.productImage.deleteMany({ where: { productId: { in: productIds } } }),
        tx.productSpec.deleteMany({ where: { productId: { in: productIds } } }),
        tx.productTag.deleteMany({ where: { productId: { in: productIds } } }),
      ])

      const deletedProducts = await tx.product.deleteMany({ where: { id: { in: productIds } } })

      return {
        productIds,
        deletedImages: images.count,
        deletedSpecs: specs.count,
        deletedTags: tags.count,
        deletedProducts: deletedProducts.count,
      }
    })

    return NextResponse.json({ ok: true, ...result })
  } catch {
    return NextResponse.json({ ok: false, error: "cleanup_failed" }, { status: 500 })
  }
}
