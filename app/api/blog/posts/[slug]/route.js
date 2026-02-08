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

    const post = await prisma.blogPost.findFirst({
      where: { slug, published: true },
      include: { category: true },
    })

    if (!post) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 })

    return NextResponse.json({ ok: true, post })
  } catch {
    return NextResponse.json({ ok: false, error: "get_failed" }, { status: 500 })
  }
}
