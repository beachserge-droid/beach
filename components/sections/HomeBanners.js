"use client"

import { useEffect, useState } from "react"

export default function HomeBanners() {
    const [banners, setBanners] = useState([
        {
            src: "/assets/img/banner/banner-03-01.jpg",
            alt: "Banner 1",
        },
        {
            src: "/assets/img/banner/banner-bg-05.jpg",
            alt: "Banner 2",
        },
    ])

    useEffect(() => {
        let cancelled = false
        const run = async () => {
            try {
                const res = await fetch("/api/banners/home_banners")
                if (!res.ok) return
                const json = await res.json().catch(() => null)
                if (!json?.ok || !json?.group?.banners) return
                const next = json.group.banners.map((b) => ({
                    src: b.imageUrl,
                    alt: b.alt || "",
                    href: b.href || null,
                }))
                if (!cancelled) setBanners(next)
            } catch {
                return
            }
        }

        run()
        return () => { cancelled = true }
    }, [])

    return (
        <section className="tp-home-banners pt-15 pb-15">
            <div className="container">
                <div className="row g-3">
                    {banners.map((banner) => (
                        <div key={banner.src} className="col-12 col-lg-6">
                            <div className="tp-home-banners__item">
                                {banner.href ? (
                                    <a href={banner.href}>
                                        <img className="tp-home-banners__img" src={banner.src} alt={banner.alt} />
                                    </a>
                                ) : (
                                    <img className="tp-home-banners__img" src={banner.src} alt={banner.alt} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
