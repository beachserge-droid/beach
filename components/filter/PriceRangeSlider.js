'use client'
import { useEffect, useState } from "react"
import Slider from "rc-slider"
import "rc-slider/assets/index.css"
import { useDispatch, useSelector } from "react-redux"
import { addprice } from "../../features/filterSlice"

const PriceRangeSlider = () => {
    const { shopList } = useSelector((state) => state.filter)

    const [price, setprice] = useState({
        min: shopList.price.min,
        max: shopList.price.max,
    })

    const dispatch = useDispatch()

    // price handler
    const handleOnChange = (value) => {
        const [min, max] = Array.isArray(value) ? value : [value, value]
        setprice({ min, max })
        dispatch(addprice({ min, max }))
    }

    useEffect(() => {
        setprice({
            min: shopList.price.min,
            max: shopList.price.max,
        })
    }, [shopList])

    return (
        <div className="range-slider-one">
            <Slider
                range
                min={0}
                max={100}
                value={[price.min, price.max]}
                onChange={handleOnChange}
            />

            <div className="input-outer">
                <div className="amount-outer">
                    <span className="area-amount">{price.max}$ </span>

                </div>
            </div>
        </div>
    )
}

export default PriceRangeSlider
