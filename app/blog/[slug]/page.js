import prisma from "@/lib/prisma"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

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

  const post = await prisma.blogPost.findFirst({
    where: { slug, published: true },
    include: { category: true, tags: { include: { tag: true } } },
  })

  if (!post) return {}

  const title = (post.seoTitle || post.title || "").trim()
  const description = (post.seoDescription || post.excerpt || "").toString().trim()
  const canonical = post.canonicalUrl ? String(post.canonicalUrl) : absUrl(`/blog/${encodeURIComponent(post.slug)}`)
  const ogImage = post.ogImage || post.coverImage || null
  const keywords = Array.isArray(post?.tags) ? post.tags.map((t) => t?.tag?.name).filter(Boolean) : []

  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params
  const slug = resolvedParams?.slug ? String(resolvedParams.slug) : ""
  if (!slug) return notFound()

  if (/^[0-9]+$/.test(slug)) {
    const id = Number(slug)
    if (id && !Number.isNaN(id)) {
      const legacy = await prisma.blogPost.findUnique({
        where: { id },
        select: { slug: true, published: true },
      })
      if (legacy?.published && legacy?.slug) {
        redirect(`/blog/${encodeURIComponent(legacy.slug)}`)
      }
    }
  }

  const [post, categories, recent] = await Promise.all([
    prisma.blogPost.findFirst({
      where: { slug, published: true },
      include: { category: true, tags: { include: { tag: true } } },
    }),
    prisma.blogCategory.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      take: 200,
    }),
    prisma.blogPost.findMany({
      where: { published: true },
      select: { title: true, slug: true, coverImage: true, publishedAt: true, createdAt: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 5,
    }),
  ])

  if (!post) return notFound()

  const canonical = post.canonicalUrl ? String(post.canonicalUrl) : absUrl(`/blog/${encodeURIComponent(post.slug)}`)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
    author: post.authorName ? { "@type": "Person", name: post.authorName } : undefined,
    image: post.ogImage || post.coverImage || undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
  }

  const breadcrumbLd = {
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
        name: "Blog",
        item: absUrl("/blog"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: canonical,
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Layout breadcrumbTitle={post.title}>
        <div className="postbox-area pt-80 pb-60">
          <div className="container">
            <div className="row">
              <div className="col-xxl-8 col-xl-8 col-lg-7 col-md-12">
                <div className="postbox__wrapper pr-20">
                  <article className="postbox__item format-image mb-50 transition-3">
                    {post.coverImage ? (
                      <div className="postbox__thumb w-img mb-30">
                        <img src={post.coverImage} alt={post.title} />
                      </div>
                    ) : null}

                    <div className="postbox__content">
                      <div className="postbox__meta mb-15">
                        {post.authorName ? (
                          <span>
                            <Link href="#">
                              <i className="fal fa-user-alt" /> {post.authorName}
                            </Link>
                          </span>
                        ) : null}
                        <span>
                          <i className="fal fa-clock" /> {new Date(post.publishedAt || post.createdAt).toLocaleDateString("tr-TR")}
                        </span>
                        {post.category?.name ? (
                          <span>
                            <Link href={`/blog?category=${encodeURIComponent(post.category.slug)}`}>{post.category.name}</Link>
                          </span>
                        ) : null}
                      </div>

                      <h1 className="mb-35">{post.title}</h1>

                      {post.contentHtml ? (
                        <div className="tp-product-desc" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
                      ) : post.excerpt ? (
                        <p>{post.excerpt}</p>
                      ) : (
                        <div className="text-muted">Bu yazı için içerik eklenmemiş.</div>
                      )}

                      {Array.isArray(post?.tags) && post.tags.length ? (
                        <div className="mt-4">
                          <div className="text-muted" style={{ fontSize: 13 }}>Etiketler</div>
                          <div className="tagcloud">
                            {post.tags
                              .map((t) => t?.tag)
                              .filter(Boolean)
                              .map((t) => (
                                <Link key={t.slug} href={`/blog/tag/${encodeURIComponent(t.slug)}`}>{t.name}</Link>
                              ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </article>
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
