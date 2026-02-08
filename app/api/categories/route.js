import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

const mapCategory = (c) => ({
  id: c.id,
  name: c.name,
  slug: c.slug,
  parentId: c.parentId,
  iconImage: c.iconImage,
  sortOrder: c.sortOrder,
})

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      take: 500,
    })

    return NextResponse.json({ ok: true, categories: categories.map(mapCategory) })
  } catch {
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 })
  }
}
