'use client'

import { addWishlist } from "@/features/wishlistSlice"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import ShopSlideCard from "../shop/ShopSlideCard"

export default function HomeCategoryProductRows() {
    const dispatch = useDispatch()

    const [allProducts, setAllProducts] = useState([])
    const [sections, setSections] = useState([])
    const [loading, setLoading] = useState(true)

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

    const addToWishlist = (id) => {
        const item = allProducts?.find((p) => p.id === id)
        dispatch(addWishlist({ product: item }))
    }

    useEffect(() => {
        let cancelled = false
        const run = async () => {
            setLoading(true)
            try {
                const [prodRes, sectionsRes] = await Promise.all([
                    fetch("/api/products"),
                    fetch("/api/homepage-sections"),
                ])

                const prodJson = prodRes.ok ? await prodRes.json().catch(() => null) : null
                const sectionsJson = sectionsRes.ok ? await sectionsRes.json().catch(() => null) : null

                if (!cancelled && prodJson?.ok && Array.isArray(prodJson.products)) {
                    setAllProducts(prodJson.products)
                }

                if (!cancelled && sectionsJson?.ok && Array.isArray(sectionsJson.sections)) {
                    setSections(sectionsJson.sections)
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        run()
        return () => { cancelled = true }
    }, [])

    // Group all products by category slug
    const productsByCategorySlug = useMemo(() => {
        const map = new Map()
        for (const p of allProducts || []) {
            const slug = p?.category?.[0]?.slug || slugify(p?.category?.[0]?.type)
            if (!slug) continue
            if (!map.has(slug)) map.set(slug, [])
            map.get(slug).push(p)
        }
        return map
    }, [allProducts])

    // If no sections configured, fall back to showing all top-level categories
    const displaySections = useMemo(() => {
        if (sections.length > 0) return sections
        
        // Fallback: create sections from all products' categories
        const categoryMap = new Map()
        for (const p of allProducts || []) {
            const cat = p?.category?.[0]
            if (!cat) continue
            const slug = cat.slug || slugify(cat.type)
            if (!categoryMap.has(slug)) {
                categoryMap.set(slug, {
                    slug,
                    title: cat.type,
                    productLimit: 4,
                    isVisible: true,
                })
            }
        }
        return Array.from(categoryMap.values())
    }, [sections, allProducts])

    const DEFAULT_PRODUCTS_PER_ROW = 4

    return (
        <section className="tp-home-cat-rows pt-40 pb-30">
            <div className="container">
                {displaySections.map((section) => {
                    const title = section.title || ""
                    const catSlug = section.slug || slugify(title)
                    const productLimit = section.productLimit || DEFAULT_PRODUCTS_PER_ROW
                    const products = productsByCategorySlug.get(catSlug) || []
                    const visibleProducts = products.slice(0, productLimit)
                    const skeletonCount = Math.max(0, productLimit - visibleProducts.length)

                    if (!title || section.isVisible === false) return null

                    return (
                        <div key={catSlug || title} className="tp-home-cat-row">
                            <div className="tp-home-cat-row__head">
                                <h3 className="tp-home-cat-row__title">{title}</h3>

                                <div className="tp-home-cat-row__actions">
                                    <Link href={`/shop?category=${encodeURIComponent(catSlug)}`} className="tp-home-cat-row__more">Tümünü Gör</Link>
                                    <div className="tp-home-cat-row__arrows">
                                        <button type="button" className="tp-arrow-btn" aria-label="Prev" disabled>
                                            <i className="far fa-long-arrow-left" />
                                        </button>
                                        <button type="button" className="tp-arrow-btn" aria-label="Next" disabled>
                                            <i className="far fa-long-arrow-right" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="tp-home-cat-row__body">
                                <div className="tp-home-cat-row__track">
                                    {!loading && visibleProducts.map((product) => (
                                        <div key={product.id} className="tp-home-cat-row__item">
                                            <ShopSlideCard item={product} addToWishlist={addToWishlist} />
                                        </div>
                                    ))}

                                    {loading && Array.from({ length: productLimit }).map((_, i) => (
                                        <div key={i} className="tp-home-cat-row__item tp-home-cat-row__item--skeleton" aria-hidden="true">
                                            <div className="tp-skeleton">
                                                <div className="tp-skeleton__thumb" />
                                                <div className="tp-skeleton__line tp-skeleton__line--lg" />
                                                <div className="tp-skeleton__line" />
                                            </div>
                                        </div>
                                    ))}

                                    {!loading && skeletonCount > 0 && Array.from({ length: skeletonCount }).map((_, i) => (
                                        <div key={`fill-${i}`} className="tp-home-cat-row__item tp-home-cat-row__item--skeleton" aria-hidden="true">
                                            <div className="tp-skeleton">
                                                <div className="tp-skeleton__thumb" />
                                                <div className="tp-skeleton__line tp-skeleton__line--lg" />
                                                <div className="tp-skeleton__line" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
