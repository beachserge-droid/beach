'use client'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addColor } from "../../features/filterSlice"

const ColorLevel = () => {
    const { shopList } = useSelector((state) => state.filter) || {}
    const selected = shopList?.color || []
    const dispatch = useDispatch()

    const [colors, setColors] = useState([])

    // dispatch product-type
    const colorHandler = (value) => {
        dispatch(addColor(value))
    }

    useEffect(() => {
        let cancelled = false
        const run = async () => {
            try {
                const res = await fetch("/api/colors")
                if (!res.ok) return
                const json = await res.json().catch(() => null)
                if (!json?.ok || !Array.isArray(json.colors)) return
                if (!cancelled) setColors(json.colors)
            } catch {
                return
            }
        }

        run()
        return () => { cancelled = true }
    }, [])

    return (
        <>
            {colors?.map((item) => (
                <div className="form-check" key={item.id || item.slug}>
                    <input
                        className="form-check-input"
                        id={`color${item.id}`}
                        type="checkbox"
                        value={item.slug}
                        checked={selected.includes(item.slug)}
                        onChange={(e) => colorHandler(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor={`color${item.id}`}>
                        {item.name}
                    </label>
                </div>
            ))}

        </>
    )
}

export default ColorLevel
