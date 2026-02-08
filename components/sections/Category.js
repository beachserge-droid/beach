"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function Category() {
    const fallback = []

    const [categories, setCategories] = useState(fallback)

    const iconSrc = (iconImage) => {
        const value = String(iconImage || "").trim()
        if (!value) return "/assets/img/icon/kırmızıjakuzi.png"
        if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) return value
        return `/assets/img/icon/${encodeURIComponent(value)}`
    }

    useEffect(() => {
        let cancelled = false
        const run = async () => {
            try {
                const res = await fetch("/api/categories")
                if (!res.ok) return
                const json = await res.json().catch(() => null)
                if (!json?.ok || !Array.isArray(json.categories)) return

                const next = json.categories
                    .filter((c) => !c.parentId)
                    .map((c) => ({ name: c.name, slug: c.slug, iconImage: c.iconImage }))

                if (!cancelled && next.length) setCategories(next)
            } catch {
                return
            }
        }

        run()
        return () => { cancelled = true }
    }, [])

    return (
        <>
            <section className="category-area pt-70">
                <div className="container">
                    <div className="row g-3 pb-45">
                        {categories.map((item) => (
                            <div key={item.slug} className="col-6 col-sm-4 col-md-3 tp-cat-col-5">
                                <Link href={`/category/${encodeURIComponent(item.slug)}`} className="card h-100 text-center border-0 shadow-sm tp-rd-cat-card">
                                    <div className="card-body d-flex flex-column align-items-center justify-content-center tp-rd-cat-card__body">
                                        <img
                                            src={iconSrc(item.iconImage)}
                                            alt={item.name}
                                            style={{ maxWidth: "110px", height: "auto" }}
                                        />
                                        <div className="mt-3" style={{ fontWeight: 600, fontSize: "14px" }}>
                                            {item.name}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
