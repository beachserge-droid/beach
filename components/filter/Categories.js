'use client'
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addCategory } from "../../features/filterSlice"

const CategoryLevel = () => {
    const { shopList } = useSelector((state) => state.filter) || {}
    const selected = shopList?.category || []
    const dispatch = useDispatch()

    const [categories, setCategories] = useState([])

    const topCategories = useMemo(
        () => (Array.isArray(categories) ? categories : []).filter((c) => !c?.parentId),
        [categories]
    )

    // dispatch product-type
    const categoryHandler = (value) => {
        dispatch(addCategory(value))
    }

    useEffect(() => {
        let cancelled = false
        const run = async () => {
            try {
                const res = await fetch("/api/categories")
                if (!res.ok) return
                const json = await res.json().catch(() => null)
                if (!json?.ok || !Array.isArray(json.categories)) return
                if (!cancelled) setCategories(json.categories)
            } catch {
                return
            }
        }

        run()
        return () => { cancelled = true }
    }, [])

    return (
        <>
            {topCategories?.map((item) => (
                <div className="form-check" key={item.id || item.slug}>
                    <input
                        className="form-check-input"
                        id={`category${item.id}`}
                        type="checkbox"
                        value={item.slug}
                        checked={selected.includes(item.slug)}
                        onChange={(e) => categoryHandler(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor={`category${item.id}`}>
                        {item.name}
                    </label>
                </div>
            ))}
        </>
    )
}

export default CategoryLevel
