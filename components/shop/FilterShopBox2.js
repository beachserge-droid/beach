'use client'
import { addWishlist } from "@/features/wishlistSlice"
import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    addPerPage,
    addSort,
    addprice,
    clearBrand,
    clearCategory,
    clearColor,
} from "../../features/filterSlice"
import ShopCard from "./ShopCard"

const FilterShopBox2 = ({ itemStart, itemEnd }) => {
    const { shopList, shopSort } = useSelector((state) => state.filter)
    const {
        price,

        category,
        color,
        brand,
    } = shopList || {}

    const { sort, perPage } = shopSort

    const dispatch = useDispatch()

    const [allProducts, setAllProducts] = useState([])

    useEffect(() => {
        let cancelled = false
        const run = async () => {
            try {
                const res = await fetch("/api/products")
                if (!res.ok) return
                const json = await res.json().catch(() => null)
                if (!json?.ok || !Array.isArray(json.products)) return
                if (!cancelled) setAllProducts(json.products)
            } catch {
                return
            }
        }

        run()
        return () => { cancelled = true }
    }, [])

    const addToCart = (id) => {
        return
    }

    const addToWishlist = (id) => {
        const item = allProducts?.find((item) => item.id === id)
        dispatch(addWishlist({ product: item }))
    }

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

    // // product-type filter



    // product-type filter
    const categoryFilter = (item) =>
        category?.length !== 0 && item?.category !== undefined
            ? category?.includes(item?.category?.[0]?.slug || slugify(item?.category?.[0]?.type))
            : item

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

    let content = allProducts.slice(itemStart, itemEnd)
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

    // clear all filters
    const clearAll = () => {
        dispatch(addprice({ min: 0, max: 100 }))




        dispatch(clearCategory())

        dispatch(clearColor())

        dispatch(clearBrand())

        dispatch(addSort(""))
        dispatch(addPerPage({ start: 0, end: 0 }))
    }


    return (
        <>
            {content}

        </>
    )
}

export default FilterShopBox2
