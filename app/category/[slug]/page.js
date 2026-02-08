import prisma from "@/lib/prisma"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { notFound } from "next/navigation"
import ShopCard from "@/components/shop/ShopCard"

export const runtime = "nodejs"

const absUrl = (path) => {
  const base = process.env.NEXT_PUBLIC_SITE_URL
  if (base) return `${base.replace(/\/$/, "")}${path}`
  return path
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const slug = resolvedParams?.slug ? String(resolvedParams.slug) : ""
  if (!slug) return {}

  const category = await prisma.category.findUnique({ 
    where: { slug },
    include: { parent: true }
  })
  if (!category) return {}

  const title = `${category.name} Jakuzi ve Spa Ürünleri | Ninico`
  const description = `${category.name} kategorisindeki premium jakuzi ve spa ürünlerini keşfedin. Kaliteli ürünler, profesyonel hizmet ve uygun fiyatlar.`
  const canonical = absUrl(`/category/${encodeURIComponent(category.slug)}`)
  const keywords = [category.name, "jakuzi", "spa", "wellness", "premium"]

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
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}

export default async function CategoryPage({ params }) {
  const resolvedParams = await params
  const slug = resolvedParams?.slug ? String(resolvedParams.slug) : ""
  if (!slug) return notFound()

  const category = await prisma.category.findUnique({ 
    where: { slug },
    include: { parent: true }
  })
  if (!category) return notFound()

  const children = await prisma.category.findMany({
    where: { parentId: category.id },
    select: { id: true },
    take: 500,
  })

  const categoryIds = [category.id, ...children.map((c) => c.id)]

  const products = await prisma.product.findMany({
    where: { published: true, categoryId: { in: categoryIds } },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      category: true,
      colors: { include: { color: true } },
    },
  })

  // Transform products to match ShopCard expected format
  const formattedProducts = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    imageMain: p.imageMain,
    imageAlt: p.imageAlt,
    price: {
      min: Number(p.priceMin ?? 0.01),
      max: Number(p.priceMax ?? 0.01),
    },
    category: p.category ? [{ type: p.category.name, slug: p.category.slug }] : [],
    color: Array.isArray(p.colors) ? p.colors.map((c) => ({ type: c.color?.name, slug: c.color?.slug, hex: c.color?.hex })) : [],
  }))

  const canonical = absUrl(`/category/${encodeURIComponent(category.slug)}`)
  
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

  // Add parent category if exists
  let position = 3
  if (category.parent) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position,
      name: category.parent.name,
      item: absUrl(`/category/${encodeURIComponent(category.parent.slug)}`),
    })
    position++
  }

  // Add current category
  breadcrumbItems.push({
    "@type": "ListItem",
    position,
    name: category.name,
    item: canonical,
  })

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  }

  // ItemList JSON-LD for products in category
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: absUrl(`/shop/${encodeURIComponent(p.slug || String(p.id))}`),
      name: p.title,
      image: p.imageMain ? absUrl(p.imageMain) : undefined,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <Layout breadcrumbTitle={category.name}>
        <section className="product-area pt-60 pb-60">
          <div className="container">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h1 className="h3 mb-0">{category.name}</h1>
              <Link href="/shop" className="btn btn-outline-primary btn-sm">Tüm Ürünler</Link>
            </div>

            {products.length ? (
              <div className="row g-4">
                {formattedProducts.map((p) => (
                  <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <ShopCard item={p} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <div className="text-muted">Bu kategoride henüz ürün yok.</div>
                <Link href="/shop" className="btn btn-primary mt-3">Tüm Ürünleri Gör</Link>
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  )
}
