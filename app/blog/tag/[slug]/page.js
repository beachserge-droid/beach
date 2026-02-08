import prisma from "@/lib/prisma"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { notFound } from "next/navigation"

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

  const tag = await prisma.blogTag.findUnique({ where: { slug } })
  if (!tag) return {}

  const title = `Blog Etiketi: ${tag.name}`
  const description = `${tag.name} etiketli blog yazıları.`
  const canonical = absUrl(`/blog/tag/${encodeURIComponent(tag.slug)}`)

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
    twitter: { card: "summary", title, description },
    robots: { index: true, follow: true },
  }
}

export default async function BlogTagPage({ params }) {
  const resolvedParams = await params
  const slug = resolvedParams?.slug ? String(resolvedParams.slug) : ""
  if (!slug) return notFound()

  const tag = await prisma.blogTag.findUnique({ where: { slug } })
  if (!tag) return notFound()

  const [posts, categories, recent] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        published: true,
        tags: {
          some: {
            tagId: tag.id,
          },
        },
      },
      include: { category: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 200,
    }),
    prisma.blogCategory.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }], take: 200 }),
    prisma.blogPost.findMany({
      where: { published: true },
      select: { title: true, slug: true, coverImage: true, publishedAt: true, createdAt: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 5,
    }),
  ])

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Blog Etiketi: ${tag.name}`,
    url: absUrl(`/blog/tag/${encodeURIComponent(tag.slug)}`),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Layout breadcrumbTitle={`Etiket: ${tag.name}`}>
        <div className="postbox-area pt-80 pb-30">
          <div className="container">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <div className="text-muted" style={{ fontSize: 13 }}>Etiket</div>
                <h1 className="h4 mb-0">{tag.name}</h1>
              </div>
              <Link href="/blog" className="btn btn-outline-secondary btn-sm">Blog</Link>
            </div>

            <div className="row">
              <div className="col-12 col-lg-8">
                {posts.map((p) => (
                  <article key={p.id} className="postbox__item format-image mb-60 transition-3">
                    {p.coverImage ? (
                      <div className="postbox__thumb w-img mb-25">
                        <Link href={`/blog/${encodeURIComponent(p.slug)}`}>
                          <img src={p.coverImage} alt={p.title} />
                        </Link>
                      </div>
                    ) : null}
                    <div className="postbox__content">
                      <div className="postbox__meta mb-15">
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
                        <div className="postbox__text mb-30"><p>{p.excerpt}</p></div>
                      ) : null}
                      <div className="postbox__read-more">
                        <Link href={`/blog/${encodeURIComponent(p.slug)}`} className="tp-btn tp-color-btn banner-animation">Devamını Oku</Link>
                      </div>
                    </div>
                  </article>
                ))}

                {posts.length === 0 ? (
                  <div className="text-muted">Bu etiketle eşleşen yazı yok.</div>
                ) : null}
              </div>

              <div className="col-12 col-lg-4">
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
                                  <img src={p.coverImage} alt={p.title} />
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
