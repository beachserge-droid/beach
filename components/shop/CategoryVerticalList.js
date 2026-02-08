'use client'
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

export default function CategoryVerticalList() {
    const slugify = (value) =>
        (value || "")
            .toString()
            .trim()
            .toLowerCase()
            .replace(/ç/g, "c")
            .replace(/ğ/g, "g")
            .replace(/ı/g, "i")
            .replace(/ö/g, "o")
            .replace(/ş/g, "s")
            .replace(/ü/g, "u")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")

    const iconBySlug = useMemo(
        () => ({
            [slugify("Kırmızı Jakuziler")]: "kırmızıjakuzi.png",
            [slugify("SPA Jakuzi")]: "spajakuzi.png",
            [slugify("Dış Mekan Jakuziler")]: "dış mekan jakuzi.png",
            [slugify("Bahçe & Teras Jakuziler")]: "bahce teras.png",
            [slugify("Açık Hava Jakuziler")]: "açık hava .png",
            [slugify("Dikdörtgen Jakuziler")]: "dikdörtgen.png",
            [slugify("Dairesel Jakuziler")]: "dairesel.png",
            [slugify("Concept Akrilik Jakuziler")]: "concept akrilik.png",
            [slugify("Siyah Jakuziler")]: "siyah.png",
            [slugify("Yedek Parça")]: "yedek parça .png",
        }),
        []
    )

    const [categories, setCategories] = useState([])
    const [collapsed, setCollapsed] = useState(true)

    const iconSrc = (iconImage, slug) => {
        const raw = iconImage || iconBySlug[slug] || "kırmızıjakuzi.png"
        const value = String(raw || "").trim()
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
                const json = await res.json()
                if (!json?.ok || !Array.isArray(json.categories)) return

                const next = json.categories.filter((c) => !c.parentId)
                if (!cancelled) setCategories(next)
            } catch {
                return
            }
        }

        run()
        return () => { cancelled = true }
    }, [])

    const visibleCategories = collapsed ? categories.slice(0, 7) : categories

    return (
        <div className="tp-cat-vertical">
            <div className="tp-cat-vertical__head">
                <h4 className="tp-cat-vertical__title">Kategoriler</h4>
            </div>

            <div className="tp-cat-vertical__list">
                {visibleCategories.map((item) => (
                    <Link key={item.slug} href={`/category/${encodeURIComponent(item.slug)}`} className="tp-cat-vertical__item">
                        <span className="tp-cat-vertical__thumb">
                            <img
                                src={iconSrc(item.iconImage, item.slug)}
                                alt={item.name}
                            />
                        </span>
                        <span className="tp-cat-vertical__name">{item.name}</span>
                        <span className="tp-cat-vertical__chev"><i className="fal fa-angle-right" /></span>
                    </Link>
                ))}

                {categories.length > 7 ? (
                    <button
                        type="button"
                        className="tp-cat-vertical__toggle"
                        onClick={() => setCollapsed((v) => !v)}
                    >
                        {collapsed ? "Tümünü Göster" : "Daha Az Göster"}
                        <i className={collapsed ? "fal fa-angle-down" : "fal fa-angle-up"} />
                    </button>
                ) : null}
            </div>
        </div>
    )
}
