import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { readFile } from "fs/promises"
import path from "path"

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

export async function POST(request) {
  try {
    const filePath = path.join(process.cwd(), "data", "products.json")
    const raw = await readFile(filePath, "utf8")
    const items = JSON.parse(raw)

    const firstTen = Array.isArray(items)
      ? items.filter((p) => Number(p?.id) >= 1 && Number(p?.id) <= 10)
      : []

    let imported = 0

    for (const item of firstTen) {
      const title = String(item?.title || "").trim()
      if (!title) continue

      const productSlug = slugify(title) || String(item?.id || "")

      const categoryName = String(item?.category?.[0]?.type || "").trim()
      let categoryId = null

      if (categoryName) {
        const categorySlug = slugify(categoryName)
        const category = await prisma.category.upsert({
          where: { slug: categorySlug },
          update: { name: categoryName },
          create: { name: categoryName, slug: categorySlug },
        })
        categoryId = category.id
      }

      const imgf = item?.imgf ? String(item.imgf) : null
      const imgb = item?.imgb ? String(item.imgb) : null

      await prisma.product.upsert({
        where: { slug: productSlug },
        update: {
          title,
          description: null,
          categoryId,
          priceMin: "0.01",
          priceMax: "0.01",
          imageMain: imgf ? `/assets/img/product/${imgf}` : null,
          imageAlt: imgb ? `/assets/img/product/${imgb}` : null,
          published: true,
        },
        create: {
          title,
          slug: productSlug,
          description: null,
          categoryId,
          priceMin: "0.01",
          priceMax: "0.01",
          imageMain: imgf ? `/assets/img/product/${imgf}` : null,
          imageAlt: imgb ? `/assets/img/product/${imgb}` : null,
          published: true,
        },
      })

      imported += 1
    }

    return NextResponse.json({ ok: true, imported })
  } catch {
    return NextResponse.json({ ok: false, error: "import_failed" }, { status: 500 })
  }
}
