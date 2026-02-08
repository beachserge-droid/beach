import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET(_request, { params }) {
  try {
    const resolvedParams = await params
    const id = Number(resolvedParams?.id)
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ ok: false, error: "id_required" }, { status: 400 })
    }

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: { category: true, tags: { include: { tag: true } } },
    })

    if (!post) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 })

    return NextResponse.json({ ok: true, post })
  } catch {
    return NextResponse.json({ ok: false, error: "get_failed" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params
    const id = Number(resolvedParams?.id)
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ ok: false, error: "id_required" }, { status: 400 })
    }

    const body = await request.json().catch(() => ({}))

    const title = body.title != null ? String(body.title).trim() : ""
    const slug = body.slug != null ? String(body.slug).trim() : ""

    if (!title || !slug) {
      return NextResponse.json({ ok: false, error: "title_slug_required" }, { status: 400 })
    }

    const published = body.published === true
    const publishedAt = published ? (body.publishedAt ? new Date(body.publishedAt) : new Date()) : null

    const categoryId = body.categoryId ? Number(body.categoryId) : null

    const tagStrings = (Array.isArray(body?.tags) ? body.tags : [])
      .map((t) => (typeof t === "string" ? t : t?.name || t?.slug))
      .map((t) => String(t || "").trim())
      .filter(Boolean)

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

    const post = await prisma.$transaction(async (tx) => {
      await tx.blogPost.update({
        where: { id },
        data: {
          title,
          slug,
          excerpt: body.excerpt != null ? String(body.excerpt) : null,
          contentHtml: body.contentHtml != null ? String(body.contentHtml) : null,
          coverImage: body.coverImage != null ? String(body.coverImage) : null,
          authorName: body.authorName != null ? String(body.authorName) : null,
          categoryId: categoryId && !Number.isNaN(categoryId) ? categoryId : null,
          published,
          publishedAt,
          seoTitle: body.seoTitle != null ? String(body.seoTitle) : null,
          seoDescription: body.seoDescription != null ? String(body.seoDescription) : null,
          canonicalUrl: body.canonicalUrl != null ? String(body.canonicalUrl) : null,
          ogImage: body.ogImage != null ? String(body.ogImage) : null,
        },
      })

      await tx.blogPostTag.deleteMany({ where: { postId: id } })

      if (tagStrings.length) {
        const tagIds = []
        for (const t of tagStrings) {
          const s = slugify(t)
          if (!s) continue
          const tag = await tx.blogTag.upsert({
            where: { slug: s },
            update: { name: t },
            create: { name: t, slug: s },
          })
          tagIds.push(tag.id)
        }

        if (tagIds.length) {
          await tx.blogPostTag.createMany({
            data: tagIds.map((tagId) => ({ postId: id, tagId })),
            skipDuplicates: true,
          })
        }
      }

      return tx.blogPost.findUnique({
        where: { id },
        include: { category: true, tags: { include: { tag: true } } },
      })
    })

    return NextResponse.json({ ok: true, post })
  } catch {
    return NextResponse.json({ ok: false, error: "update_failed" }, { status: 500 })
  }
}

export async function DELETE(_request, { params }) {
  try {
    const resolvedParams = await params
    const id = Number(resolvedParams?.id)
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ ok: false, error: "id_required" }, { status: 400 })
    }

    await prisma.blogPost.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: "delete_failed" }, { status: 500 })
  }
}
