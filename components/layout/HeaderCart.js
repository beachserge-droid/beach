'use client'
import { addQty, deleteCart } from "@/features/shopSlice"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"

export default function HeaderCart({ isCartSidebar, handleCartSidebar }) {
    const { cart } = useSelector((state) => state.shop) || {}

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

    const dispatch = useDispatch()

    // delete cart item
    const deleteCartHandler = (id) => {
        dispatch(deleteCart(id))
    }

    // qty handler
    let total = 0;
    cart?.forEach((item) => {
        const price = item.qty * item.price?.max;
        total = total + price;
    });
    return (
        <>
            <div className={`tpcartinfo tp-cart-info-area p-relative ${isCartSidebar ? "tp-sidebar-opened" : ""}`}>
                <button className="tpcart__close" onClick={handleCartSidebar}><i className="fal fa-times" /></button>
                <div className="tpcart">
                    <h4 className="tpcart__title">Sepetiniz</h4>
                    <div className="tpcart__product">
                        <div className="tpcart__product-list">
                            <ul>
                                {cart?.map((item,i) => (
                                    <li key={i}>
                                        <div className="tpcart__item">
                                            <div className="tpcart__img">
                                                <img src={`/assets/img/product/${item.imgf}`} alt="" />
                                                <div className="tpcart__del" onClick={() => deleteCartHandler(item?.id)}>
                                                    <Link href="#"><i className="far fa-times-circle" /></Link>
                                                </div>
                                            </div>
                                            <div className="tpcart__content">
                                                <span className="tpcart__content-title"><Link href={`/shop/${item?.slug || slugify(item?.title) || String(item?.id || "")}`}>{item.title}</Link>
                                                </span>
                                                <div className="tpcart__cart-price">
                                                    <span className="quantity">{item?.qty} x </span>
                                                    <span className="new-price">$ {item?.price.max}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="tpcart__checkout">
                            <div className="tpcart__total-price d-flex justify-content-between align-items-center">
                                <span> Ara Toplam:</span>
                                <span className="heilight-price"> ${total.toFixed(2)}</span>
                            </div>
                            <div className="tpcart__checkout-btn">
                                <Link className="tpcart-btn mb-10" href="/cart">Sepeti Gör</Link>
                                <Link className="tpcheck-btn" href="/checkout">Ödeme</Link>
                            </div>
                        </div>
                    </div>
                    <div className="tpcart__free-shipping text-center">
                        <span><b>10 km</b> altındaki siparişlerde ücretsiz teslimat</span>
                    </div>
                </div>
            </div>
            <div className={`cartbody-overlay ${isCartSidebar ? "opened" : ""}`} onClick={handleCartSidebar} />
        </>
    )
}
