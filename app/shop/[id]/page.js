import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import ProductClient from "./ProductClient"

export const runtime = "nodejs"

const getProductByIdOrSlug = async (idOrSlug) => {
    const raw = String(idOrSlug || "")
    const numericId = /^[0-9]+$/.test(raw) ? Number(raw) : null

    const product = await prisma.product.findUnique({
        where: numericId ? { id: numericId } : { slug: raw },
        include: {
            category: { include: { parent: true } },
            images: { orderBy: { sortOrder: "asc" } },
            specs: { orderBy: { sortOrder: "asc" } },
            tags: { include: { tag: true } },
            infoBoxes: { orderBy: { sortOrder: "asc" } },
            features: { orderBy: { sortOrder: "asc" } },
            colors: { include: { color: true } },
        },
    })

    return product
}

const toClientProduct = (p) => ({
    id: p.id,
    title: p.title,
    sku: p.sku || null,
    description: p.description || "",
    videoUrl: p.videoUrl || "",
    price: {
        min: Number(p.priceMin ?? 0.01),
        max: Number(p.priceMax ?? 0.01),
    },
    imageMain: p.imageMain || null,
    imageAlt: p.imageAlt || null,
    images: Array.isArray(p.images) ? p.images : [],
    specs: Array.isArray(p.specs) ? p.specs : [],
    tags: Array.isArray(p.tags) ? p.tags.map((t) => ({ id: t.tag.id, name: t.tag.name, slug: t.tag.slug })) : [],
    infoBoxes: Array.isArray(p.infoBoxes) ? p.infoBoxes : [],
    features: Array.isArray(p.features) ? p.features : [],
    color: Array.isArray(p.colors) ? p.colors.map((c) => ({ type: c.color?.name, slug: c.color?.slug, hex: c.color?.hex })) : [],
    category: p.category
        ? (p.category.parent
            ? [
                { type: p.category.parent.name, slug: p.category.parent.slug },
                { type: p.category.name, slug: p.category.slug },
            ]
            : [{ type: p.category.name, slug: p.category.slug }])
        : [],
})

const absUrl = (path) => {
    const base = process.env.NEXT_PUBLIC_SITE_URL
    if (base) return `${base.replace(/\/$/, "")}${path}`
    return path
}

export async function generateMetadata({ params }) {
    const resolvedParams = await params
    const id = resolvedParams?.id
    const p = await getProductByIdOrSlug(id)
    if (!p) return {}

    // Use admin SEO fields if available, fallback to defaults
    const title = p.seoTitle || `${p.title} | Premium Jakuzi`
    const description = p.seoDescription || (p.description ? String(p.description).slice(0, 160) : `${p.title} - Premium jakuzi ve spa ürünleri.`)
    const keywords = p.seoKeywords ? p.seoKeywords.split(',').map(k => k.trim()) : [p.title, p.category?.name, "jakuzi", "spa", "wellness", "premium"].filter(Boolean)
    const canonical = p.canonicalUrl || absUrl(`/shop/${encodeURIComponent(p.slug || String(p.id))}`)
    const ogImageUrl = p.ogImage || p.imageMain

    return {
        title,
        description,
        keywords,
        alternates: {
            canonical,
        },
        openGraph: {
            title,
            description,
            url: canonical,
            images: ogImageUrl ? [{ url: absUrl(ogImageUrl), alt: p.title }] : undefined,
            type: "product",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ogImageUrl ? [absUrl(ogImageUrl)] : undefined,
        },
        robots: {
            index: !p.noIndex,
            follow: !p.noIndex,
        },
    }
}

export default async function ShopProductPage({ params }) {
    const resolvedParams = await params
    const id = resolvedParams?.id

    const p = await getProductByIdOrSlug(id)
    if (!p) return notFound()

    const canonical = absUrl(`/shop/${encodeURIComponent(p.slug || String(p.id))}`)
    
    // Product JSON-LD with enhanced data
    const productJsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: p.title,
        sku: p.sku || undefined,
        description: p.description || undefined,
        image: p.imageMain ? [absUrl(p.imageMain)] : undefined,
        url: canonical,
        brand: {
            "@type": "Brand",
            name: "Ninico",
        },
        category: p.category?.name || undefined,
        offers: {
            "@type": "Offer",
            priceCurrency: "TRY",
            price: Number(p.priceMax ?? 0.01),
            availability: "https://schema.org/InStock",
            url: canonical,
            seller: {
                "@type": "Organization",
                name: "Ninico",
            },
        },
        ...(p.colors?.length ? {
            color: p.colors.map((c) => c.color?.name).filter(Boolean).join(", "),
        } : {}),
    }

    // Breadcrumb JSON-LD
    const breadcrumbItems = [
        {
            "@type": "ListItem",
            position: 1,
            name: "Anasayfa",
            item: absUrl("/"),
        },
        {
            "@type": "ListItem",
            position: 2,
            name: "Ürünler",
            item: absUrl("/shop"),
        },
    ]

    let position = 3
    if (p.category?.parent) {
        breadcrumbItems.push({
            "@type": "ListItem",
            position,
            name: p.category.parent.name,
            item: absUrl(`/category/${encodeURIComponent(p.category.parent.slug)}`),
        })
        position++
    }

    if (p.category) {
        breadcrumbItems.push({
            "@type": "ListItem",
            position,
            name: p.category.name,
            item: absUrl(`/category/${encodeURIComponent(p.category.slug)}`),
        })
        position++
    }

    breadcrumbItems.push({
        "@type": "ListItem",
        position,
        name: p.title,
        item: canonical,
    })

    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems,
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            <ProductClient id={id} initialProduct={toClientProduct(p)} />
        </>
    )
}
