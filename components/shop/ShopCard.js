"use client"

import Link from "next/link"

const formatPrice = (price) => {
    const num = Number(price)
    if (isNaN(num)) return "0.00"
    return num.toFixed(2)
}

const ShopCard = ({ item, addToWishlist }) => {

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

    const productSlug = item?.slug || slugify(item?.title) || String(item?.id || "")
    const productHref = `/shop/${productSlug}`

    const mainImgSrc = item?.imageMain
        ? item.imageMain
        : `/assets/img/product/${item.imgf}`
    const altImgSrc = item?.imageAlt
        ? item.imageAlt
        : `/assets/img/product/${item.imgb}`

    const colorDots = Array.isArray(item?.color)
        ? item.color
            .map((c) => ({
                slug: c?.slug ? String(c.slug) : "",
                name: c?.type ? String(c.type) : "",
                hex: c?.hex ? String(c.hex) : "",
            }))
            .filter((c) => c.slug || c.name || c.hex)
        : []

    const priceMin = item?.price?.min ?? 0
    const priceMax = item?.price?.max ?? 0
    const priceDisplay = priceMin === priceMax 
        ? `₺${formatPrice(priceMin)}`
        : `₺${formatPrice(priceMin)} - ₺${formatPrice(priceMax)}`

    const handleOfferClick = (e) => {
        e.preventDefault()
        const offerEmail = process.env.NEXT_PUBLIC_OFFER_EMAIL
        if (!offerEmail || typeof window === "undefined") return

        const productUrl = window.location.href
        const subject = encodeURIComponent(`Teklif Talebi: ${item.title}`)
        const body = encodeURIComponent(
            `Ürün Adı: ${item.title}\n` +
            `Ürün Linki: ${productUrl}\n` +
            `Fiyat: ${priceDisplay}\n\n` +
            `Lütfen aşağıdaki bilgileri doldurup gönderin:\n` +
            `- Adınız:\n` +
            `- Telefon:\n` +
            `- Şehir:\n` +
            `- Not:`
        )

        window.location.href = `mailto:${offerEmail}?subject=${subject}&body=${body}`
    }

    return (
        <>
            <div className="col">
                <div className="tpproduct tpproductitem mb-15 p-relative tp-shop-card">
                    <div className="tpproduct__thumb">
                        <div className="tpproduct__thumbitem p-relative tp-shop-card__thumb">
                            <Link href={productHref}>
                                <img src={mainImgSrc} alt="product-thumb" />
                                <img className="thumbitem-secondary" src={altImgSrc} alt="product-thumb" />
                            </Link>
                        </div>
                    </div>
                    <div className="tpproduct__content-area tp-shop-card__content">
                        <h3 className="tpproduct__title mb-5 tp-shop-card__title"><Link href={productHref}>{item.title}</Link></h3>
                        <div className="tpproduct__priceinfo p-relative">
                            <div className="tpproduct__ammount">
                                <span>{priceDisplay}</span>
                            </div>
                        </div>
                        <div className="tpproduct__actions mt-3">
                            <a onClick={handleOfferClick} className="tp-shop-card__offer">
                                <i className="fal fa-envelope" />
                                Teklif Al
                            </a>
                            <a onClick={() => addToWishlist(item.id)} className="tp-shop-card__wish" aria-label="Favorilere ekle">
                                <i className="fal fa-heart" />
                            </a>
                        </div>
                    </div>
                    <div className="tpproduct__ratingarea">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="tpproductdot">
                                {(colorDots.length ? colorDots.slice(0, 6) : []).map((c, idx) => (
                                    <Link
                                        key={`${c.slug || c.hex || "color"}-${idx}`}
                                        className="tpproductdot__variationitem"
                                        href={productHref}
                                        title={c.name || c.slug || "Renk"}
                                        aria-label={c.name || c.slug || `Renk ${idx + 1}`}
                                    >
                                        <div className="tpproductdot__termshape">
                                            <span
                                                className="tpproductdot__termshape-bg"
                                                style={c.hex ? { backgroundColor: c.hex } : undefined}
                                            />
                                            <span
                                                className="tpproductdot__termshape-border"
                                                style={c.hex ? { borderColor: c.hex } : undefined}
                                            />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ShopCard