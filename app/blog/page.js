import prisma from "@/lib/prisma"
import Layout from "@/components/layout/Layout"
import Link from "next/link"

export const runtime = "nodejs"

const absUrl = (path) => {
  const base = process.env.NEXT_PUBLIC_SITE_URL
  if (base) return `${base.replace(/\/$/, "")}${path}`
  return path
}

export async function generateMetadata({ searchParams }) {
  const categorySlug = searchParams?.category ? String(searchParams.category) : ""

  let categoryName = ""
  if (categorySlug) {
    const c = await prisma.blogCategory.findUnique({ where: { slug: categorySlug } }).catch(() => null)
    categoryName = c?.name ? String(c.name) : ""
  }

  const title = categoryName ? `Blog - ${categoryName}` : "Blog | Güncel Haberler ve Makaleler"
  const description = categoryName 
    ? `${categoryName} kategorisindeki blog yazıları. Jakuzi, spa ve wellness hakkında güncel bilgiler.` 
    : "Jakuzi, spa ve wellness hakkında güncel blog yazıları, haberler ve uzman makaleleri."
  const canonical = categorySlug ? absUrl(`/blog?category=${encodeURIComponent(categorySlug)}`) : absUrl("/blog")

  return {
    title,
    description,
    keywords: ["blog", "jakuzi", "spa", "wellness", "haberler", "makaleler"],
    alternates: { canonical },
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

export default async function BlogPage({ searchParams }) {
  const categorySlug = searchParams?.category ? String(searchParams.category) : ""

  const [categories, posts, recent] = await Promise.all([
    prisma.blogCategory.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }], take: 200 }),
    prisma.blogPost.findMany({
      where: {
        published: true,
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      },
      include: { category: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 20,
    }),
    prisma.blogPost.findMany({
      where: { published: true },
      select: { title: true, slug: true, coverImage: true, publishedAt: true, createdAt: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 5,
    }),
  ])

  const activeCategory = categorySlug ? categories.find((c) => c.slug === categorySlug) : null

  const canonical = categorySlug ? absUrl(`/blog?category=${encodeURIComponent(categorySlug)}`) : absUrl("/blog")

  // Blog Listing JSON-LD
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: activeCategory ? `Blog - ${activeCategory.name}` : "Ninico Blog",
    url: canonical,
    description: activeCategory ? `${activeCategory.name} kategorisindeki blog yazıları` : "Jakuzi, spa ve wellness hakkında güncel blog yazıları",
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
      name: "Blog",
      item: absUrl("/blog"),
    },
  ]

  if (activeCategory) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: activeCategory.name,
      item: canonical,
    })
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Layout breadcrumbTitle="Blog">
        <div className="postbox-area pt-80 pb-30">
          <div className="container">
            <div className="row">
              <div className="col-xxl-8 col-xl-8 col-lg-7 col-md-12">
                <div className="postbox pr-20 pb-50">
                  {activeCategory ? (
                    <div className="mb-4">
                      <div className="text-muted" style={{ fontSize: 13 }}>Kategori</div>
                      <h2 className="h5 mb-0">{activeCategory.name}</h2>
                      <div className="mt-2">
                        <Link href="/blog" className="btn btn-outline-secondary btn-sm">Filtreyi Temizle</Link>
                      </div>
                    </div>
                  ) : null}
                  {posts.map((p) => (
                    <article key={p.id} className="postbox__item format-image mb-60 transition-3">
                      {p.coverImage ? (
                        <div className="postbox__thumb w-img mb-25">
                          <Link href={`/blog/${encodeURIComponent(p.slug)}`}>
                            <img src={p.coverImage} alt={p.title} loading="lazy" width="800" height="450" />
                          </Link>
                        </div>
                      ) : null}
                      <div className="postbox__content">
                        <div className="postbox__meta mb-15">
                          {p.authorName ? (
                            <span>
                              <span className="meta-author"><i className="fal fa-user-alt" /> {p.authorName}</span>
                            </span>
                          ) : null}
                          <span>
                            <i className="fal fa-clock" /> {new Date(p.publishedAt || p.createdAt).toLocaleDateString("tr-TR")}
                          </span>
                          {p.category?.name ? (
                            <span>
                              <Link href={`/blog?category=${encodeURIComponent(p.category.slug)}`}>{p.category.name}</Link>
                            </span>
                          ) : null}
                        </div>
                        <h3 className="postbox__title mb-20">
                          <Link href={`/blog/${encodeURIComponent(p.slug)}`}>{p.title}</Link>
                        </h3>
                        {p.excerpt ? (
                          <div className="postbox__text mb-30">
                            <p>{p.excerpt}</p>
                          </div>
                        ) : null}
                        <div className="postbox__read-more">
                          <Link href={`/blog/${encodeURIComponent(p.slug)}`} className="tp-btn tp-color-btn banner-animation">
                            Devamını Oku
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}

                  {posts.length === 0 ? (
                    <div className="text-muted">Henüz blog yazısı yok.</div>
                  ) : null}
                </div>
              </div>

              <div className="col-xxl-4 col-xl-4 col-lg-5 col-md-12">
                <div className="sidebar__wrapper pl-25 pb-50">
                  <div className="sidebar__widget mb-40">
                    <h3 className="sidebar__widget-title mb-25">Kategoriler</h3>
                    <div className="sidebar__widget-content">
                      <ul>
                        {categories.map((c) => (
                          <li key={c.id}>
                            <Link href={`/blog?category=${encodeURIComponent(c.slug)}`}>{c.name}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="sidebar__widget mb-55">
                    <h3 className="sidebar__widget-title mb-25">Son Yazılar</h3>
                    <div className="sidebar__widget-content">
                      <div className="sidebar__post rc__post">
                        {recent.map((p) => (
                          <div key={p.slug} className="rc__post mb-20 d-flex align-items-center">
                            {p.coverImage ? (
                              <div className="rc__post-thumb">
                                <Link href={`/blog/${encodeURIComponent(p.slug)}`}>
                                  <img src={p.coverImage} alt={p.title} loading="lazy" width="80" height="80" />
                                </Link>
                              </div>
                            ) : null}
                            <div className="rc__post-content">
                              <div className="rc__meta">
                                <span>{new Date(p.publishedAt || p.createdAt).toLocaleDateString("tr-TR")}</span>
                              </div>
                              <h3 className="rc__post-title">
                                <Link href={`/blog/${encodeURIComponent(p.slug)}`}>{p.title}</Link>
                              </h3>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
