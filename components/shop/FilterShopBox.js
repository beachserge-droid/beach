'use client'
import { addWishlist } from "@/features/wishlistSlice"
import { Fragment, useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    addBrand,
    addCategory,
    addColor,
    addPerPage,
    addParentCategory,
    addSizeCategory,
    addSort,
    addprice,
    clearBrand,
    clearCategory,
    clearColor,
    clearParentCategory,
    clearSizeCategory,
} from "../../features/filterSlice"
import ShopCard from "./ShopCard"
import ShopCardList from "./ShopCardList"

const FilterShopBox = () => {
    const { shopList, shopSort } = useSelector((state) => state.filter)
    const {
        price,
        category,
        parentCategory,
        sizeCategory,
        color,
        brand,
    } = shopList || {}

    const { sort, perPage } = shopSort

    const dispatch = useDispatch()

    const [allProducts, setAllProducts] = useState([])
    const [categoriesList, setCategoriesList] = useState([])
    const [categoriesAll, setCategoriesAll] = useState([])

    useEffect(() => {
        let cancelled = false
        const run = async () => {
            try {
                const res = await fetch("/api/products")
                if (!res.ok) return
                const json = await res.json()
                if (!json?.ok || !Array.isArray(json.products)) return
                if (!cancelled) setAllProducts(json.products)
            } catch {
                return
            }
        }

        run()
        return () => { cancelled = true }
    }, [])

    useEffect(() => {
        let cancelled = false
        const run = async () => {
            try {
                const res = await fetch("/api/categories")
                if (!res.ok) return
                const json = await res.json().catch(() => null)
                if (!json?.ok || !Array.isArray(json.categories)) return
                const all = Array.isArray(json.categories) ? json.categories : []
                const top = all.filter((c) => !c?.parentId)
                if (!cancelled) {
                    setCategoriesAll(all)
                    setCategoriesList(top)
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

    const addToCart = (id) => {
        const offerEmail = process.env.NEXT_PUBLIC_OFFER_EMAIL
        if (!offerEmail || typeof window === "undefined") return

        const item = allProducts?.find((p) => p.id === id)
        if (!item) return

        const subject = encodeURIComponent(`Teklif Talebi: ${item.title}`)
        const body = encodeURIComponent(
            `Ürün Adı: ${item.title}\n` +
            `Ürün Linki: ${window.location.href}\n` +
            `Fiyat: 0.01 TRY (Temsili)\n\n` +
            `Lütfen aşağıdaki bilgileri doldurup gönderin:\n` +
            `- Adınız:\n` +
            `- Telefon:\n` +
            `- Şehir:\n` +
            `- Not:`
        )

        window.location.href = `mailto:${offerEmail}?subject=${subject}&body=${body}`
    }
    const addToWishlist = (id) => {
        const item = allProducts?.find((item) => item.id === id)
        dispatch(addWishlist({ product: item }))
    }

    // view is fixed to grid for premium catalog listing

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

    // location filter
    const priceFilter = (item) =>
        item?.price?.min >= price?.min && item?.price?.max <= price?.max

    // product-type filter

    // product-type filter
    const categoryFilter = (item) => {
        const itemSlug = item?.category?.[0]?.slug || slugify(item?.category?.[0]?.type) || ""
        const parentSlugs = Array.isArray(parentCategory) ? parentCategory : []
        const sizeSlugs = Array.isArray(sizeCategory) ? sizeCategory : []
        const allowedSlugs = [...parentSlugs, ...sizeSlugs]
        if (!allowedSlugs.length) return item
        return allowedSlugs.includes(itemSlug)
    }

    // product-type filter
    const colorFilter = (item) =>
        color?.length !== 0 && item?.color !== undefined
            ? color?.some((c) => item?.color?.some((x) => x?.slug === c))
            : item

    // product-type filter
    const brandFilter = (item) =>
        brand?.length !== 0 && item?.brand !== undefined ? brand?.includes(item?.brand[0]?.type.toLocaleLowerCase().split(" ").join("-")) : item

    // sort filter
    const sortFilter = (a, b) =>
        sort === "des" ? a.id > b.id && -1 : a.id < b.id && -1

    let content = allProducts
        ?.filter(priceFilter)

        ?.filter(categoryFilter)
        ?.filter(colorFilter)
        ?.filter(brandFilter)
        ?.sort(sortFilter).slice(perPage.start, perPage.end !== 0 ? perPage.end : 10)?.map((item, i) => (
            <Fragment key={i}>
                <ShopCard item={item} addToCart={addToCart} addToWishlist={addToWishlist} />
            </Fragment>
            // End all products
        ))

    // sort handler
    const sortHandler = (e) => {
        dispatch(addSort(e.target.value))
    }

    // per page handler
    const perPageHandler = (e) => {
        const pageData = JSON.parse(e.target.value)
        dispatch(addPerPage(pageData))
    }
    const sizeTitle = "Ölçü"
    const selectedCategorySlug = Array.isArray(category) && category.length ? String(category[0] || "") : ""
    const sizeSubcategories = useMemo(() => {
        const all = Array.isArray(categoriesAll) ? categoriesAll : []
        const sizes = (items) =>
            (items || [])
                .map((c) => ({
                    id: c?.id,
                    slug: c?.slug ? String(c.slug) : "",
                    name: c?.name ? String(c.name) : "",
                    parentId: c?.parentId ?? null,
                }))
                .filter((c) => c.slug && c.name)

        const selected = selectedCategorySlug
            ? all.find((c) => String(c.slug || "") === selectedCategorySlug)
            : null

        if (selected?.id) {
            const children = sizes(all.filter((c) => c?.parentId === selected.id))
            if (children.length) return children
        }

        const allChildren = sizes(all.filter((c) => Boolean(c?.parentId)))
        const isSize = (name) => /\d+\s*[xX×]\s*\d+/.test(String(name || ""))
        const sizeFirst = allChildren
            .slice()
            .sort((a, b) => {
                const as = isSize(a.name) ? 0 : 1
                const bs = isSize(b.name) ? 0 : 1
                if (as !== bs) return as - bs
                return a.name.localeCompare(b.name, "tr")
            })

        return sizeFirst.slice(0, 12)
    }, [categoriesAll, selectedCategorySlug])

    const topCategorySlugs = useMemo(
        () => new Set((Array.isArray(categoriesList) ? categoriesList : []).map((c) => String(c?.slug || "")).filter(Boolean)),
        [categoriesList]
    )

    const sizeCategorySlugs = useMemo(
        () => new Set((Array.isArray(sizeSubcategories) ? sizeSubcategories : []).map((c) => String(c?.slug || "")).filter(Boolean)),
        [sizeSubcategories]
    )

    const categorySelectValue = useMemo(() => {
        const v = Array.isArray(parentCategory) && parentCategory.length ? String(parentCategory[0] || "") : ""
        return v && topCategorySlugs.has(v) ? v : ""
    }, [parentCategory, topCategorySlugs])

    const sizeSelectValue = useMemo(() => {
        const v = Array.isArray(sizeCategory) && sizeCategory.length ? String(sizeCategory[0] || "") : ""
        return v && sizeCategorySlugs.has(v) ? v : ""
    }, [sizeCategory, sizeCategorySlugs])

    const categorySelectHandler = (e) => {
        const value = String(e.target.value || "")
        dispatch(clearParentCategory())
        if (value) dispatch(addParentCategory(value))
    }

    const sizeSelectHandler = (e) => {
        const value = String(e.target.value || "")
        dispatch(clearSizeCategory())
        if (value) dispatch(addSizeCategory(value))
    }

    const onPickSize = (slug) => {
        const value = String(slug || "")
        dispatch(clearCategory())
        if (value) dispatch(addCategory(value))
    }

    const displaySizeLabel = (name) => {
        const raw = String(name || "").trim()
        if (!raw) return ""
        const m = raw.match(/(\d+)\s*[xX×]\s*(\d+)/)
        if (m?.[1] && m?.[2]) return `${m[1]}×${m[2]}`
        return raw
    }

    // clear all filters
    const clearAll = () => {
        dispatch(addprice({ min: 0, max: 100 }))
        dispatch(clearCategory())
        dispatch(clearParentCategory())
        dispatch(clearSizeCategory())
        dispatch(clearColor())
        dispatch(clearBrand())
        dispatch(addSort(""))
        dispatch(addPerPage({ start: 0, end: 0 }))
    }



    return (
        <>
            <div className="product-filter-content mb-40">
                <div className="tp-shop-toolbar">
                    <div className="tp-shop-toolbar__right">
                        <div className="product-navtabs d-flex justify-content-end align-items-center">
                            <div className="tp-shop-selector">

                                {price?.min !== 0 ||
                                    price?.max !== 100 ||

                                    category?.length !== 0 ||
                                    color?.length !== 0 ||
                                    brand?.length !== 0 ||
                                    sort !== "" ||
                                    perPage.start !== 0 ||
                                    perPage.end !== 0 ? (
                                    <button
                                        onClick={clearAll}
                                        className="btn btn-danger text-nowrap me-2 tp-shop-clear-btn"
                                    >
                                        Temizle
                                    </button>
                                ) : undefined}

                                <select
                                    value={sort}
                                    className="chosen-single form-select"
                                    onChange={sortHandler}
                                >
                                    <option value="">Sırala (varsayılan)</option>
                                    <option value="asc">En Yeni</option>
                                    <option value="des">En Eski</option>
                                </select>

                                <select
                                    value={categorySelectValue}
                                    className="chosen-single form-select"
                                    onChange={categorySelectHandler}
                                    title="Kategori filtresi"
                                >
                                    <option value="">Kategori (tümü)</option>
                                    {categoriesList.map((c) => (
                                        <option key={c.slug || c.id} value={c.slug}>{c.name}</option>
                                    ))}
                                </select>


                                <select
                                    onChange={perPageHandler}
                                    className="chosen-single form-select"
                                    value={JSON.stringify(perPage)}
                                >
                                    <option
                                        value={JSON.stringify({
                                            start: 0,
                                            end: 0,
                                        })}
                                    >
                                        Tümü
                                    </option>
                                    <option
                                        value={JSON.stringify({
                                            start: 0,
                                            end: 10,
                                        })}
                                    >
                                        Sayfa başına 10
                                    </option>
                                    <option
                                        value={JSON.stringify({
                                            start: 0,
                                            end: 20,
                                        })}
                                    >
                                        Sayfa başına 20
                                    </option>
                                    <option
                                        value={JSON.stringify({
                                            start: 0,
                                            end: 30,
                                        })}
                                    >
                                        Sayfa başına 30
                                    </option>
                                </select>

                                {sizeSubcategories.length ? (
                                    <select
                                        value={sizeSelectValue}
                                        className="chosen-single form-select"
                                        onChange={sizeSelectHandler}
                                        title="Ölçü filtresi"
                                    >
                                        <option value="">Ölçü (tümü)</option>
                                        {sizeSubcategories.map((s) => (
                                            <option key={s.slug || s.id} value={s.slug}>
                                                {displaySizeLabel(s.name) || s.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>

                {(price?.min !== 0 ||
                    price?.max !== 100 ||
                    category?.length !== 0 ||
                    color?.length !== 0 ||
                    brand?.length !== 0) && (
                    <div className="tp-shop-advanced-filters mt-3">
                        <div className="tp-shop-advanced-filters__label">Aktif Filtreler</div>
                        <div className="tp-shop-advanced-filters__chips">
                            {(price?.min !== 0 || price?.max !== 100) && (
                                <button
                                    type="button"
                                    className="tp-shop-filter-chip"
                                    onClick={() => dispatch(addprice({ min: 0, max: 100 }))}
                                >
                                    <span className="tp-shop-filter-chip__text">Fiyat: {price?.min} - {price?.max}</span>
                                    <span className="tp-shop-filter-chip__x"><i className="fal fa-times" /></span>
                                </button>
                            )}

                            {(category || []).map((c) => (
                                <button
                                    key={`cat-${c}`}
                                    type="button"
                                    className="tp-shop-filter-chip"
                                    onClick={() => dispatch(addCategory(c))}
                                    title="Kategori filtresini kaldır"
                                >
                                    <span className="tp-shop-filter-chip__text">Kategori: {c}</span>
                                    <span className="tp-shop-filter-chip__x"><i className="fal fa-times" /></span>
                                </button>
                            ))}

                            {(color || []).map((c) => (
                                <button
                                    key={`color-${c}`}
                                    type="button"
                                    className="tp-shop-filter-chip"
                                    onClick={() => dispatch(addColor(c))}
                                    title="Renk filtresini kaldır"
                                >
                                    <span className="tp-shop-filter-chip__text">Renk: {c}</span>
                                    <span className="tp-shop-filter-chip__x"><i className="fal fa-times" /></span>
                                </button>
                            ))}

                            {(brand || []).map((b) => (
                                <button
                                    key={`brand-${b}`}
                                    type="button"
                                    className="tp-shop-filter-chip"
                                    onClick={() => dispatch(addBrand(b))}
                                    title="Marka filtresini kaldır"
                                >
                                    <span className="tp-shop-filter-chip__text">Marka: {b}</span>
                                    <span className="tp-shop-filter-chip__x"><i className="fal fa-times" /></span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>


            <div className="row mb-50">
                <div className="col-lg-12">
                    <div className="row row-cols-xxl-4 row-cols-xl-4 row-cols-lg-3 row-cols-md-3 row-cols-sm-2 row-cols-1 tpproduct">
                        {
                            allProducts
                                ?.filter(priceFilter)
                                ?.filter(categoryFilter)
                                ?.filter(colorFilter)
                                ?.filter(brandFilter)
                                ?.sort(sortFilter).slice(perPage.start, perPage.end !== 0 ? perPage.end : 10)?.map((item, i) => (
                                    <Fragment key={i}>
                                        <ShopCard item={item} addToCart={addToCart} addToWishlist={addToWishlist} />
                                    </Fragment>
                                    // End all products
                                ))
                        }
                    </div>
                </div>
            </div>

        </>
    )
}

export default FilterShopBox
