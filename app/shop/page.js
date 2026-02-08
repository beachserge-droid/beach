import prisma from "@/lib/prisma"
import ShopClient from "./ShopClient"

export const runtime = "nodejs"

const absUrl = (path) => {
    const base = process.env.NEXT_PUBLIC_SITE_URL
    if (base) return `${base.replace(/\/$/, "")}${path}`
    return path
}

export async function generateMetadata() {
    const canonical = absUrl("/shop")
    return {
        title: "Tüm Ürünler | Jakuzi ve Spa Koleksiyonu",
        description: "Ninico'nun tüm jakuzi, spa ve wellness ürünlerini keşfedin. Premium kalite, profesyonel tasarım ve uygun fiyatlar.",
        keywords: ["tüm ürünler", "jakuzi", "spa", "wellness", "ürün koleksiyonu"],
        alternates: {
            canonical,
        },
        openGraph: {
            title: "Tüm Ürünler | Jakuzi ve Spa Koleksiyonu",
            description: "Ninico'nun tüm jakuzi, spa ve wellness ürünlerini keşfedin.",
            url: canonical,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: "Tüm Ürünler | Jakuzi ve Spa Koleksiyonu",
            description: "Ninico'nun tüm jakuzi, spa ve wellness ürünlerini keşfedin.",
        },
    }
}

export default async function ShopPage() {
    const products = await prisma.product.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 24,
        select: { id: true, slug: true, title: true, imageMain: true, description: true },
    })

    const canonical = absUrl("/shop")
    
    // ItemList JSON-LD for product listing
    const itemListJsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: products.map((p, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            url: absUrl(`/shop/${encodeURIComponent(p.slug || String(p.id))}`),
            name: p.title,
            image: p.imageMain ? [absUrl(p.imageMain)] : undefined,
        })),
        url: canonical,
    }

    // Breadcrumb JSON-LD
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
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
                item: canonical,
            },
        ],
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            <ShopClient />
        </>
    )
}