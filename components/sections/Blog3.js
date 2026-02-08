import Link from "next/link";

export default function Blog3() {
    return (
        <>
            <section className="blog-area pb-30 pt-65">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-12">
                            <div className="tpsection mb-40">
                                <h4 className="tpsection__title">Blog Insights</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row gx-6">
                        <div className="col-lg-3 col-md-6 col-sm-6 tpblogborder mb-20">
                            <div className="blogitem">
                                <div className="blogitem__thumb fix mb-20">
                                    <Link href="/blog/1">
                                        <img src="assets/img/blog/blog-thumb-05.jpg" alt="blog-bg" />
                                    </Link>
                                </div>
                                <div className="blogitem__content">
                                    <div className="blogitem__contetn-date mb-10">
                                        <ul>
                                            <li>
                                                <Link className="date-color" href="#">
                                                    Jan 21, 2026
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/blog">Fashion</Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <h4 className="blogitem__title mb-15">
                                        <Link href="/blog/1">Here is why you cannot miss EORS 15</Link>
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 tpblogborder mb-20">
                            <div className="blogitem">
                                <div className="blogitem__thumb fix mb-20">
                                    <Link href="/blog/1">
                                        <img src="assets/img/blog/blog-thumb-06.jpg" alt="blog-bg" />
                                    </Link>
                                </div>
                                <div className="blogitem__content">
                                    <div className="blogitem__contetn-date mb-10">
                                        <ul>
                                            <li>
                                                <Link className="date-color" href="#">
                                                    Jan 21, 2026
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/blog">Fashion</Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <h4 className="blogitem__title">
                                        <Link href="/blog/1">Myntra launches international brand DeFacto</Link>
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 tpblogborder mb-20">
                            <div className="blogitem">
                                <div className="blogitem__thumb fix mb-20">
                                    <Link href="/blog/1">
                                        <img src="assets/img/blog/blog-thumb-07.jpg" alt="blog-bg" />
                                    </Link>
                                </div>
                                <div className="blogitem__content">
                                    <div className="blogitem__contetn-date mb-10">
                                        <ul>
                                            <li>
                                                <Link className="date-color" href="#">
                                                    Jan 21, 2026
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/blog">Fashion</Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <h4 className="blogitem__title">
                                        <Link href="/blog/1">Ruskin Bond Shares His Life Experiences</Link>
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 mb-20">
                            <div className="blogitem">
                                <div className="blogitem__thumb fix mb-20">
                                    <Link href="/blog/1">
                                        <img src="assets/img/blog/blog-thumb-08.jpg" alt="blog-bg" />
                                    </Link>
                                </div>
                                <div className="blogitem__content">
                                    <div className="blogitem__contetn-date mb-10">
                                        <ul>
                                            <li>
                                                <Link className="date-color" href="#">
                                                    Jan 21, 2026
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/blog">Fashion</Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <h4 className="blogitem__title">
                                        <Link href="/blog/1">The House That Will Instantly Update</Link>
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
