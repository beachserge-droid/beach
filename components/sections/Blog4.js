import prisma from "@/lib/prisma"
import Link from "next/link";

export const runtime = "nodejs"

export default async function Blog4() {
    const posts = await prisma.blogPost.findMany({
        where: { published: true },
        include: { category: true },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: 4,
    })

    return (
        <>
            <section className="blog-area pb-35 pt-65">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-12">
                            <div className="tpsection mb-40">
                                <h4 className="tpsection__title">Blog</h4>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="tpallblog mb-20 text-end">
                                <h4 className="blog-btn">
                                    <Link href="/blog">
                                        Tüm Yazılar <i className="far fa-long-arrow-right" />
                                    </Link>
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className="row gx-6">
                        {posts.map((p, idx) => (
                            <div key={p.id} className={`col-lg-3 col-md-6 col-sm-6 ${idx < 3 ? "tpblogborder" : ""} mb-30`}>
                                <div className="blogitem">
                                    <div className="blogitem__thumb fix mb-20">
                                        <Link href={`/blog/${encodeURIComponent(p.slug)}`}>
                                            <img src={p.coverImage || "assets/img/blog/blog-thumb-01.jpg"} alt={p.title} />
                                        </Link>
                                    </div>
                                    <div className="blogitem__content">
                                        <div className="blogitem__contetn-date mb-10">
                                            <ul>
                                                <li>
                                                    <Link className="date-color" href="#">
                                                        {new Date(p.publishedAt || p.createdAt).toLocaleDateString("tr-TR")}
                                                    </Link>
                                                </li>
                                                {p.category?.name ? (
                                                    <li>
                                                        <Link href={`/blog?category=${encodeURIComponent(p.category.slug)}`}>{p.category.name}</Link>
                                                    </li>
                                                ) : null}
                                            </ul>
                                        </div>
                                        <h4 className="blogitem__title mb-15">
                                            <Link href={`/blog/${encodeURIComponent(p.slug)}`}>{p.title}</Link>
                                        </h4>
                                        <div className="blogitem__btn">
                                            <Link href={`/blog/${encodeURIComponent(p.slug)}`}>Devamını Oku</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {posts.length === 0 ? (
                            <div className="text-muted">Henüz blog yazısı yok.</div>
                        ) : null}
                    </div>
                </div>
            </section>
        </>
    );
}
