'use client'
import { addQty, deleteWishlist } from "@/features/wishlistSlice"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"

const WishlistItems = () => {
    const { wishlist } = useSelector((state) => state.wishlist) || {}

    const dispatch = useDispatch()

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

    const handleOfferClick = (item) => (e) => {
        e.preventDefault()
        const offerEmail = process.env.NEXT_PUBLIC_OFFER_EMAIL
        if (!offerEmail || typeof window === "undefined") return

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

    // delete cart item
    const deleteCartHandler = (id) => {
        dispatch(deleteWishlist(id))
    }

    // qty handler
    const qtyHandler = (id, qty) => {
        dispatch(addQty({ id, qty }))
    }

    return (
        <>
            {wishlist?.map((item) => (
                (() => {
                    const productSlug = item?.slug || slugify(item?.title) || String(item?.id || "")
                    const productHref = `/shop/${productSlug}`
                    return (
                <tr className="cart-item" key={item.id}>
                    <td className="product-thumbnail">
                        <Link href={productHref}>
                            <img
                                src={`/assets/img/product/${item.imgf}`} alt="cart added product" />
                        </Link>
                    </td>

                    <td className="product-name">
                        <Link href={productHref}>
                            {item.title}
                        </Link>
                    </td>

                    <td className="product-price">${item.price.max}</td>

                    <td className="product-quantity">
                        <div className="item-quantity">
                            <input
                                type="number"
                                className="qty"
                                name="qty"
                                defaultValue={item?.qty}
                                min={1}
                                onChange={(e) =>
                                    qtyHandler(item?.id, e.target.value)
                                }
                            />
                        </div>
                    </td>

                    <td className="product-subtotal">
                        <span className="amount">
                            ${(item?.qty * item?.price.max).toFixed(2)}
                        </span>
                    </td>
                    <td className="product-add-to-cart">
                        <a onClick={handleOfferClick(item)} className="tp-btn tp-color-btn  tp-wish-cart banner-animation">Teklif Al (E-posta)</a>
                    </td>
                    <td className="product-remove">
                        <button
                            onClick={() => deleteCartHandler(item?.id)}
                            className="remove"
                        >
                            <span className="flaticon-dustbin">Kaldır</span>
                        </button>
                    </td>
                </tr>
                    )
                })()
            ))}
        </>
    )
}

export default WishlistItems
