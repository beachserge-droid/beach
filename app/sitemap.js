import prisma from "@/lib/prisma"

export const runtime = "nodejs"

export default async function sitemap() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const lastModified = new Date()

    const [categories, products, blogPosts] = await Promise.all([
        prisma.category.findMany({
            select: { slug: true, updatedAt: true },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            take: 2000,
        }),
        prisma.product.findMany({
            select: { slug: true, updatedAt: true, published: true },
            where: { published: true },
            orderBy: { updatedAt: "desc" },
            take: 5000,
        }),
        prisma.blogPost.findMany({
            select: { slug: true, updatedAt: true, published: true },
            where: { published: true },
            orderBy: { updatedAt: "desc" },
            take: 5000,
        }),
    ])

    const staticUrls = [
        { url: `${siteUrl}/`, lastModified },
        { url: `${siteUrl}/shop`, lastModified },
        { url: `${siteUrl}/blog`, lastModified },
        { url: `${siteUrl}/contact`, lastModified },
    ]

    const categoryUrls = categories
        .filter((c) => c?.slug)
        .map((c) => ({
            url: `${siteUrl}/category/${encodeURIComponent(c.slug)}`,
            lastModified: c.updatedAt || lastModified,
        }))

    const productUrls = products
        .filter((p) => p?.slug)
        .map((p) => ({
            url: `${siteUrl}/shop/${encodeURIComponent(p.slug)}`,
            lastModified: p.updatedAt || lastModified,
        }))

    const blogUrls = blogPosts
        .filter((p) => p?.slug)
        .map((p) => ({
            url: `${siteUrl}/blog/${encodeURIComponent(p.slug)}`,
            lastModified: p.updatedAt || lastModified,
        }))

    return [...staticUrls, ...categoryUrls, ...productUrls, ...blogUrls]
}
