import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, Number(searchParams.get("page") || 1))
    const pageSizeRaw = Number(searchParams.get("pageSize") || 10)
    const pageSize = Math.min(50, Math.max(1, Number.isNaN(pageSizeRaw) ? 10 : pageSizeRaw))
    const categorySlug = searchParams.get("category") ? String(searchParams.get("category")) : ""

    const where = {
      published: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    }

    const [total, posts] = await Promise.all([
      prisma.blogPost.count({ where }),
      prisma.blogPost.findMany({
        where,
        include: { category: true },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ])

    return NextResponse.json({ ok: true, posts, page, pageSize, total })
  } catch {
    return NextResponse.json({ ok: false, error: "get_failed" }, { status: 500 })
  }
}
