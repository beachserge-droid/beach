'use client'
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addQty, deleteCart } from "@/features/shopSlice";

const CartItems = () => {
    const { cart } = useSelector((state) => state.shop) || {};

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

    const dispatch = useDispatch();

    // delete cart item
    const deleteCartHandler = (id) => {
        dispatch(deleteCart(id));
    };

    // qty handler
    const qtyHandler = (id, qty) => {
        dispatch(addQty({ id, qty }));
    };

    return (
        <>
            {cart?.map((item) => (
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
    );
};

export default CartItems;
