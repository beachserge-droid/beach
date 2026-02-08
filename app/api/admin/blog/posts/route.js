import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

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

const ensureUniqueSlug = async (baseSlug) => {
  const rawBase = String(baseSlug || "").trim()
  const cleanBase = rawBase || "post"

  let candidate = cleanBase
  let n = 2

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const exists = await prisma.blogPost.findUnique({ where: { slug: candidate } })
    if (!exists) return candidate
    candidate = `${cleanBase}-${n}`
    n += 1
    if (n > 50) return `${cleanBase}-${Date.now()}`
  }
}

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      include: { category: true, tags: { include: { tag: true } } },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 500,
    })
    return NextResponse.json({ ok: true, posts })
  } catch {
    return NextResponse.json({ ok: false, error: "get_failed" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))

    const title = body.title != null ? String(body.title).trim() : ""
    if (!title) {
      return NextResponse.json({ ok: false, error: "title_required" }, { status: 400 })
    }

    const slugRaw = body.slug != null ? String(body.slug).trim() : ""
    const baseSlug = slugify(slugRaw || title)
    const slug = await ensureUniqueSlug(baseSlug)

    const published = body.published === true
    const publishedAt = published ? (body.publishedAt ? new Date(body.publishedAt) : new Date()) : null

    const categoryId = body.categoryId ? Number(body.categoryId) : null

    const tagStrings = (Array.isArray(body?.tags) ? body.tags : [])
      .map((t) => (typeof t === "string" ? t : t?.name || t?.slug))
      .map((t) => String(t || "").trim())
      .filter(Boolean)

    const post = await prisma.$transaction(async (tx) => {
      const created = await tx.blogPost.create({
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

      const postId = created.id

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
            data: tagIds.map((tagId) => ({ postId, tagId })),
            skipDuplicates: true,
          })
        }
      }

      return tx.blogPost.findUnique({
        where: { id: postId },
        include: { category: true, tags: { include: { tag: true } } },
      })
    })

    return NextResponse.json({ ok: true, post })
  } catch {
    return NextResponse.json({ ok: false, error: "create_failed" }, { status: 500 })
  }
}
