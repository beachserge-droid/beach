'use client'

import Layout from "@/components/layout/Layout"
import CategoryVerticalList from "@/components/shop/CategoryVerticalList"
import FilterShopBox from "@/components/shop/FilterShopBox"
import { addCategory, clearCategory } from "@/features/filterSlice"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

export default function ShopClient() {
    const searchParams = useSearchParams()
    const dispatch = useDispatch()

    const [sidebarBanner, setSidebarBanner] = useState({ imageUrl: "", href: "", alt: "" })

    const categoryParam = searchParams.get("category")

    useEffect(() => {
        dispatch(clearCategory())
        if (categoryParam) {
            dispatch(addCategory(categoryParam))
        }
    }, [categoryParam, dispatch])

    useEffect(() => {
        let cancelled = false
        const run = async () => {
            try {
                const res = await fetch("/api/banners/shop_sidebar")
                if (!res.ok) return
                const json = await res.json().catch(() => null)
                const first = json?.group?.banners?.[0]
                if (!first?.imageUrl) return
                if (!cancelled) {
                    setSidebarBanner({
                        imageUrl: String(first.imageUrl || ""),
                        href: String(first.href || ""),
                        alt: String(first.alt || "Shop banner"),
                    })
                }
            } catch {
                return
            }
        }

        run()
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <>
            <Layout breadcrumbTitle="Ürünler">
                <div className="product-filter-area pt-50 pb-90 tp-shop-premium tp-shop-page">
                    <div className="container">
                        <h1 className="visually-hidden">Ürünler</h1>

                        <div className="row g-4">
                            <div className="col-12 col-lg-4 col-xl-3">
                                <div className="tp-shop-panel tp-shop-sidebar">
                                    <CategoryVerticalList />

                                    {sidebarBanner.imageUrl ? (
                                        sidebarBanner.href ? (
                                            <a className="tp-shop-sidebar-banner mt-4" href={sidebarBanner.href} aria-label="Shop banner">
                                                <img
                                                    className="tp-shop-sidebar-banner__img"
                                                    src={sidebarBanner.imageUrl}
                                                    alt={sidebarBanner.alt || "Shop banner"}
                                                    loading="lazy"
                                                />
                                            </a>
                                        ) : (
                                            <div className="tp-shop-sidebar-banner mt-4" aria-label="Shop banner">
                                                <img
                                                    className="tp-shop-sidebar-banner__img"
                                                    src={sidebarBanner.imageUrl}
                                                    alt={sidebarBanner.alt || "Shop banner"}
                                                    loading="lazy"
                                                />
                                            </div>
                                        )
                                    ) : null}
                                </div>
                            </div>
                            <div className="col-12 col-lg-8 col-xl-9">
                                <div className="tp-shop-panel tp-shop-results">
                                    <FilterShopBox itemStart={10} itemEnd={18} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}
