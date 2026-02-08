'use client'
import Link from "next/link"
import Layout from "@/components/layout/Layout"
import { useEffect, useMemo, useRef, useState } from "react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const swiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    slidesPerView: 1,
    spaceBetween: 0,
    loop: false,
    watchOverflow: true,
    autoHeight: true,
    autoplay: {
        delay: 3500,
        disableOnInteraction: true,
    },
    pagination: { clickable: true },
}

export default function ProductClient({ id, initialProduct }) {
    const [product, setProduct] = useState(initialProduct || {})
    const [infoBoxes, setInfoBoxes] = useState([])
    const [globalInfoBoxes, setGlobalInfoBoxes] = useState([])
    const [galleryIndex, setGalleryIndex] = useState(0)
    const [gallerySwiper, setGallerySwiper] = useState(null)
    const galleryRef = useRef(null)
    const [zoomOpen, setZoomOpen] = useState(false)
    const [zoomUrl, setZoomUrl] = useState("")

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

    useEffect(() => {
        let cancelled = false

        const mapDbProductToUi = (p) => ({
            id: p.id,
            title: p.title,
            sku: p.sku || null,
            description: p.description || "",
            videoUrl: p.videoUrl || "",
            price: {
                min: Number(p.priceMin ?? 0.01),
                max: Number(p.priceMax ?? 0.01),
            },
            imageMain: p.imageMain || null,
            imageAlt: p.imageAlt || null,
            images: Array.isArray(p.images) ? p.images : [],
            specs: Array.isArray(p.specs) ? p.specs : [],
            tags: Array.isArray(p.tags) ? p.tags : [],
            category: p.category ? [{ type: p.category.name, slug: p.category.slug }] : [],
            infoBoxes: Array.isArray(p.infoBoxes) ? p.infoBoxes : [],
            features: Array.isArray(p.features) ? p.features : [],
            color: Array.isArray(p.colors)
                ? p.colors
                    .map((c) => ({
                        type: c?.name ? String(c.name) : "",
                        slug: c?.slug ? String(c.slug) : "",
                        hex: c?.hex ? String(c.hex) : "",
                    }))
                    .filter((c) => c.type || c.slug || c.hex)
                : [],
        })

        const normalizeAnyProductToUi = (p) => {
            if (!p || typeof p !== "object") return {}

            if (Array.isArray(p.colors)) {
                return mapDbProductToUi(p)
            }

            if (Array.isArray(p.color)) {
                return {
                    ...p,
                    color: p.color
                        .map((c) => ({
                            type: c?.type ? String(c.type) : "",
                            slug: c?.slug ? String(c.slug) : "",
                            hex: c?.hex ? String(c.hex) : "",
                        }))
                        .filter((c) => c.type || c.slug || c.hex),
                }
            }

            return p
        }

        const run = async () => {
            if (!id) return

            if (initialProduct?.id || initialProduct?.title) {
                const normalized = normalizeAnyProductToUi(initialProduct)
                if (!cancelled) setProduct(normalized)

                const hasColors = Array.isArray(normalized?.color) && normalized.color.length > 0
                if (hasColors) return
            }

            try {
                const res = await fetch(`/api/products/${encodeURIComponent(String(id))}`)
                if (!res.ok) return
                const json = await res.json()
                if (!json?.ok || !json?.product) return
                if (!cancelled) setProduct(mapDbProductToUi(json.product))
            } catch {
                return
            }
        }

        run()
        return () => {
            cancelled = true
        }
    }, [id, initialProduct])

    useEffect(() => {
        let cancelled = false
        const run = async () => {
            try {
                const res = await fetch("/api/banners/product_info_boxes")
                if (!res.ok) return
                const json = await res.json().catch(() => null)
                const banners = json?.ok ? json?.group?.banners : null
                if (!Array.isArray(banners)) return
                if (!cancelled) setGlobalInfoBoxes(banners)
            } catch {
                return
            }
        }

        run()
        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        const perProduct = Array.isArray(product?.infoBoxes) ? product.infoBoxes : []
        if (perProduct.length) {
            setInfoBoxes(perProduct)
        } else {
            setInfoBoxes(globalInfoBoxes)
        }
    }, [product?.infoBoxes, globalInfoBoxes])

    const [activeIndex, setActiveIndex] = useState(2)
    const handleOnClick = (index) => {
        setActiveIndex(index)
    }

    const handleOfferClick = (e) => {
        e.preventDefault()
        const offerEmail = process.env.NEXT_PUBLIC_OFFER_EMAIL
        if (!offerEmail || typeof window === "undefined") return

        const productUrl = window.location.href
        const categoryPath = Array.isArray(product?.category)
            ? product.category.map((c) => c?.type).filter(Boolean).join(" > ")
            : ""

        const subject = encodeURIComponent(`Teklif Talebi: ${product.title}`)
        const body = encodeURIComponent(
            `Ürün Adı: ${product.title}\n` +
            (product?.sku ? `SKU: ${product.sku}\n` : "") +
            (categoryPath ? `Kategori: ${categoryPath}\n` : "") +
            `Ürün Linki: ${productUrl}\n` +
            `Fiyat: ${Number(product?.price?.max ?? 0.01)} TRY (Temsili)\n\n` +
            `Teklif için aşağıdaki bilgileri doldurup gönderin:\n` +
            `- Ad Soyad:\n` +
            `- Telefon:\n` +
            `- Şehir:\n` +
            `- Adet:\n` +
            `- Not:`
        )

        window.location.href = `mailto:${offerEmail}?subject=${subject}&body=${body}`
    }

    const categoryHref = (slugOrName) => {
        const s = String(slugOrName || "").trim()
        const finalSlug = s ? s : ""
        const safe = finalSlug ? finalSlug : slugify(s)
        return `/category/${encodeURIComponent(safe)}`
    }

    const galleryImages = useMemo(() => {
        const list = []
        if (product?.imageMain) list.push({ url: product.imageMain, alt: product?.title || "" })
        if (product?.imageAlt && product.imageAlt !== product.imageMain) list.push({ url: product.imageAlt, alt: product?.title || "" })
        const extra = Array.isArray(product?.images) ? product.images : []
        for (const im of extra) {
            const url = im?.url
            if (!url) continue
            if (list.some((x) => x.url === url)) continue
            list.push({ url, alt: im?.alt || product?.title || "" })
        }
        return list
    }, [product?.imageMain, product?.imageAlt, product?.images, product?.title])

    useEffect(() => {
        if (!galleryImages.length) return
        if (galleryIndex >= galleryImages.length) setGalleryIndex(0)
    }, [galleryImages, galleryIndex])

    const onGalleryMove = (e) => {
        const el = galleryRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        const cx = Math.max(0, Math.min(100, x))
        const cy = Math.max(0, Math.min(100, y))
        el.style.setProperty("--tp-zoom-x", `${cx}%`)
        el.style.setProperty("--tp-zoom-y", `${cy}%`)
    }

    const onGalleryLeave = () => {
        const el = galleryRef.current
        if (!el) return
        el.style.setProperty("--tp-zoom-x", "50%")
        el.style.setProperty("--tp-zoom-y", "50%")
    }

    const openZoom = (url) => {
        const u = String(url || "").trim()
        if (!u) return
        setZoomUrl(u)
        setZoomOpen(true)
    }

    const closeZoom = () => {
        setZoomOpen(false)
    }

    useEffect(() => {
        if (!zoomOpen) return
        const onKey = (e) => {
            if (e.key === "Escape") closeZoom()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [zoomOpen])

    const skuText = product?.sku
        ? String(product.sku)
        : product?.id
            ? `SKU-${product.id}`
            : ""

    const tagsList = Array.isArray(product?.tags) ? product.tags : []
    const specsList = Array.isArray(product?.specs) ? product.specs : []

    const colorsList = (Array.isArray(product?.color) ? product.color : Array.isArray(product?.colors) ? product.colors : [])
        .map((c) => ({
            type: c?.type ? String(c.type) : c?.name ? String(c.name) : "",
            slug: c?.slug ? String(c.slug) : "",
            hex: c?.hex ? String(c.hex) : "",
        }))
        .filter((c) => c.type || c.slug || c.hex)

    const videoUrl = String(product?.videoUrl || "").trim()
    const featureItems = useMemo(() => {
        const list = Array.isArray(product?.features) ? product.features : []
        return list
            .map((f) => ({
                imageUrl: f?.imageUrl ? String(f.imageUrl) : "",
                title: f?.title ? String(f.title) : "",
                subtitle: f?.subtitle ? String(f.subtitle) : "",
                isActive: f?.isActive === false ? false : true,
                sortOrder: Number(f?.sortOrder || 0),
            }))
            .filter((f) => f.isActive && f.imageUrl && f.title)
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    }, [product?.features])

    const getVideoEmbed = (url) => {
        const u = String(url || "").trim()
        if (!u) return null

        const lower = u.toLowerCase()
        const isMp4 = lower.includes(".mp4") || lower.includes(".webm") || lower.includes(".ogg")
        if (isMp4) {
            return { type: "video", src: u }
        }

        try {
            const parsed = new URL(u)
            const host = parsed.hostname.replace(/^www\./, "")

            if (host === "youtube.com" || host === "m.youtube.com") {
                const v = parsed.searchParams.get("v")
                if (v) return { type: "iframe", src: `https://www.youtube.com/embed/${encodeURIComponent(v)}` }
            }

            if (host === "youtu.be") {
                const id = parsed.pathname.split("/").filter(Boolean)[0]
                if (id) return { type: "iframe", src: `https://www.youtube.com/embed/${encodeURIComponent(id)}` }
            }

            if (host === "vimeo.com") {
                const id = parsed.pathname.split("/").filter(Boolean)[0]
                if (id && /^[0-9]+$/.test(id)) return { type: "iframe", src: `https://player.vimeo.com/video/${encodeURIComponent(id)}` }
            }
        } catch {
            return { type: "link", src: u }
        }

        return { type: "link", src: u }
    }

    const resolvedInfoBoxes = useMemo(() => {
        const fallback = [
            { iconUrl: "/assets/img/icon/product-det-1.png", title: "Free Shipping apply to all", subtitle: "orders over $100", color: "" },
            { iconUrl: "/assets/img/icon/product-det-2.png", title: "Guranteed 100% Organic", subtitle: "from natural farmas", color: "" },
            { iconUrl: "/assets/img/icon/product-det-3.png", title: "1 Day Returns if you change", subtitle: "your mind", color: "" },
            { iconUrl: "/assets/img/icon/product-det-4.png", title: "Covid-19 Info: We keep", subtitle: "delivering.", color: "" },
        ]

        const src = Array.isArray(infoBoxes) && infoBoxes.length ? infoBoxes : fallback

        return src
            .map((b) => ({
                iconUrl: b?.iconUrl || b?.imageUrl || "",
                alt: b?.alt || "",
                title: b?.title || "",
                subtitle: b?.subtitle || "",
                color: b?.color || b?.variant || "",
                isActive: b?.isActive === false ? false : true,
            }))
            .filter((b) => b.isActive && (b.title || b.subtitle) && b.iconUrl)
    }, [infoBoxes])

    return (
        <>
            <Layout breadcrumbTitle={product?.title || "Ürün Detayı"}>
                <section className="product-area pt-80 pb-50">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 col-md-12">
                                <div
                                    ref={galleryRef}
                                    className="tpproduct-details__list-img tp-product-gallery"
                                    style={{ overflow: "hidden", borderRadius: 12 }}
                                    onMouseMove={onGalleryMove}
                                    onMouseLeave={onGalleryLeave}
                                >
                                    <Swiper
                                        {...swiperOptions}
                                        onSwiper={setGallerySwiper}
                                        onSlideChange={(s) => setGalleryIndex(s.activeIndex || 0)}
                                    >
                                        {galleryImages.map((im, idx) => (
                                            <SwiperSlide key={im.url}>
                                                <img
                                                    src={im.url}
                                                    alt={im.alt || ""}
                                                    className="tp-product-gallery__main-img"
                                                    style={{ width: "100%", height: "auto", borderRadius: 12 }}
                                                    onClick={() => openZoom(im.url)}
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>

                                {galleryImages.length > 1 ? (
                                    <div className="mt-3 d-flex gap-2 tp-product-gallery__thumbs" style={{ flexWrap: "nowrap", overflowX: "auto" }}>
                                        {galleryImages.map((im, idx) => (
                                            <button
                                                key={`${im.url}-thumb-${idx}`}
                                                type="button"
                                                className="btn p-0"
                                                onClick={() => {
                                                    setGalleryIndex(idx)
                                                    if (gallerySwiper && typeof gallerySwiper.slideTo === "function") {
                                                        gallerySwiper.slideTo(idx)
                                                    }
                                                }}
                                                style={{
                                                    border: idx === galleryIndex ? "2px solid #dc3545" : "1px solid #e5e5e5",
                                                    borderRadius: 10,
                                                    overflow: "hidden",
                                                    background: "#fff",
                                                }}
                                            >
                                                <img src={im.url} alt={im.alt || ""} style={{ width: 76, height: 76, objectFit: "cover", display: "block" }} />
                                            </button>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                            <div className="col-lg-4 col-md-7">
                                <div className="tpproduct-details__content tpproduct-details__sticky">
                                    <div className="tpproduct-details__tag-area d-flex align-items-center mb-5">
                                        {product?.category?.length ? (
                                            <Link
                                                className="tpproduct-details__tag"
                                                href={categoryHref((product.category[product.category.length - 1]?.slug) || (product.category[product.category.length - 1]?.type))}
                                            >
                                                {product.category[product.category.length - 1]?.type}
                                            </Link>
                                        ) : null}
                                    </div>
                                    <div className="tpproduct-details__title-area d-flex align-items-center flex-wrap mb-5">
                                        <h3 className="tpproduct-details__title">{product?.title}</h3>
                                        <span className="tpproduct-details__stock">Stokta</span>
                                    </div>
                                    <div className="tpproduct-details__price mb-30">
                                        <span>₺ {Number(product?.price?.max ?? 0.01)}</span>
                                    </div>
                                    <div className="tpproduct-details__pera">
                                        {product?.description ? (
                                            <div
                                                className="tp-product-desc"
                                                onClick={(e) => {
                                                    const el = e.target
                                                    if (el && el.tagName === "IMG" && el.getAttribute) {
                                                        const src = el.getAttribute("src")
                                                        if (src) openZoom(src)
                                                    }
                                                }}
                                                dangerouslySetInnerHTML={{ __html: String(product.description) }}
                                            />
                                        ) : (
                                            <p>Bu ürün modern tasarımıyla konforu bir araya getirir.<br />Detaylı bilgi için ürün açıklamalarını inceleyebilirsiniz.<br />Teklif almak için bizimle iletişime geçebilirsiniz.</p>
                                        )}
                                    </div>

                                    {videoUrl ? (
                                        <div className="mt-4">
                                            <div style={{ fontWeight: 600, marginBottom: 10 }}>Ürün Videosu</div>
                                            {(() => {
                                                const embed = getVideoEmbed(videoUrl)
                                                if (!embed) return null
                                                if (embed.type === "video") {
                                                    return (
                                                        <video
                                                            src={embed.src}
                                                            controls
                                                            style={{ width: "100%", borderRadius: 10, background: "#000" }}
                                                        />
                                                    )
                                                }
                                                if (embed.type === "iframe") {
                                                    return (
                                                        <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 10, overflow: "hidden", background: "#000" }}>
                                                            <iframe
                                                                src={embed.src}
                                                                title="product-video"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                                allowFullScreen
                                                                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                                                            />
                                                        </div>
                                                    )
                                                }
                                                return (
                                                    <a href={embed.src} target="_blank" rel="noreferrer" className="btn btn-outline-secondary btn-sm">
                                                        Videoyu Aç
                                                    </a>
                                                )
                                            })()}
                                        </div>
                                    ) : null}
                                    <div className="tpproduct-details__count d-flex align-items-center flex-wrap mb-25">
                                        <div className="product-quantity">
                                            <div className="item-quantity">
                                                <input
                                                    type="number"
                                                    className="qty"
                                                    name="qty"
                                                    defaultValue={1}
                                                    min={1}
                                                    onChange={() => { }}
                                                />
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2 ms-3 flex-wrap">
                                            <button type="button" className="btn btn-danger" onClick={handleOfferClick}>
                                                <i className="fal fa-envelope" /> Teklif Al
                                            </button>
                                            <button type="button" className="btn btn-outline-secondary" aria-label="Favori">
                                                <i className="fal fa-heart" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="tpproduct-details__information tpproduct-details__code">
                                        <p>SKU:</p><span>{skuText}</span>
                                    </div>
                                    <div className="tpproduct-details__information tpproduct-details__categories">
                                        <p>Kategoriler:</p>
                                        {product?.category?.map((cat, i) => (
                                            <span key={`${cat?.type}-${i}`}>
                                                <Link href={categoryHref(cat?.slug || cat?.type)}>{cat?.type}</Link>
                                                {i < product.category.length - 1 ? " → " : ""}
                                            </span>
                                        ))}
                                    </div>
                                    {colorsList.length ? (
                                        <div className="tpproduct-details__information tpproduct-details__categories">
                                            <p>Renkler:</p>
                                            <div className="d-flex align-items-center flex-wrap" style={{ gap: 10 }}>
                                                <div className="tpproductdot" style={{ marginRight: 6 }}>
                                                    {colorsList.slice(0, 8).map((c, idx) => (
                                                        <span key={`${c.slug || c.hex || "color"}-${idx}`} className="tpproductdot__variationitem" title={c.type || c.slug || "Renk"} aria-label={c.type || c.slug || `Renk ${idx + 1}`}>
                                                            <div className="tpproductdot__termshape">
                                                                <span className="tpproductdot__termshape-bg" style={c.hex ? { backgroundColor: c.hex } : undefined} />
                                                                <span className="tpproductdot__termshape-border" style={c.hex ? { borderColor: c.hex } : undefined} />
                                                            </div>
                                                        </span>
                                                    ))}
                                                </div>
                                                <div>
                                                    {colorsList.map((c, i) => (
                                                        <span key={`${c.slug || c.type}-${i}`} className="me-2">
                                                            {c.type || c.slug}{i < colorsList.length - 1 ? "," : ""}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                    <div className="tpproduct-details__information tpproduct-details__tags">
                                        <p>Etiketler:</p>
                                        {tagsList.length ? (
                                            tagsList.map((t, i) => (
                                                <span key={`${t.slug || t.name}-${i}`}>
                                                    <Link href={`/shop?tag=${encodeURIComponent(t.slug || t.name)}`}>{t.name || t.slug}{i < tagsList.length - 1 ? "," : ""}</Link>
                                                </span>
                                            ))
                                        ) : (
                                            product?.category?.map((cat, i) => (
                                                <span key={`${cat?.type}-tag-${i}`}>
                                                    <Link href={categoryHref(cat?.type)}>{cat?.type}{i < product.category.length - 1 ? "," : ""}</Link>
                                                </span>
                                            ))
                                        )}
                                    </div>
                                    <div className="tpproduct-details__information tpproduct-details__social">
                                        <p>Paylaş:</p>
                                        <span className="social-icon"><i className="fab fa-facebook-f" /></span>
                                        <span className="social-icon"><i className="fab fa-twitter" /></span>
                                        <span className="social-icon"><i className="fab fa-behance" /></span>
                                        <span className="social-icon"><i className="fab fa-youtube" /></span>
                                        <span className="social-icon"><i className="fab fa-linkedin" /></span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-5">
                                <div className="tp-advantage">
                                    {resolvedInfoBoxes.map((b, idx) => (
                                        <div className="tp-advantage__item" key={idx}>
                                            <div className="tp-advantage__icon">
                                                <img src={b.iconUrl} alt={b.alt || ""} />
                                            </div>
                                            <div className="tp-advantage__text" style={b.color ? { color: b.color } : undefined}>
                                                <div className="tp-advantage__title">{b.title || ""}</div>
                                                {b.subtitle ? <div className="tp-advantage__subtitle">{b.subtitle}</div> : null}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="product-setails-area">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="tpproduct-details__navtab mb-60">
                                    <div className="tpproduct-details__nav mb-30">
                                        <ul className="nav nav-tabs pro-details-nav-btn" id="myTabs" role="tablist">
                                            <li className="nav-item" onClick={() => handleOnClick(1)}>
                                                <button className={activeIndex == 1 ? "nav-links active" : "nav-links"}>Açıklama</button>
                                            </li>
                                            <li className="nav-item" onClick={() => handleOnClick(2)}>
                                                <button className={activeIndex == 2 ? "nav-links active" : "nav-links"}>Ürün Özellikleri</button>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="tab-content tp-content-tab" id="myTabContent-2">
                                        <div className={activeIndex == 1 ? "tab-para tab-pane fade show active" : "tab-para tab-pane fade"}>
                                            {product?.description ? (
                                                <div
                                                    className="tp-product-desc"
                                                    onClick={(e) => {
                                                        const el = e.target
                                                        if (el && el.tagName === "IMG" && el.getAttribute) {
                                                            const src = el.getAttribute("src")
                                                            if (src) openZoom(src)
                                                        }
                                                    }}
                                                    dangerouslySetInnerHTML={{ __html: String(product.description) }}
                                                />
                                            ) : (
                                                <p className="mb-30">Bu ürün için açıklama eklenmemiş.</p>
                                            )}
                                        </div>
                                        <div className={activeIndex == 2 ? "tab-pane fade show active" : "tab-pane fade"}>
                                            {featureItems.length ? (
                                                <div className="row g-3 mb-4">
                                                    {featureItems.map((f, idx) => (
                                                        <div className="col-6 col-md-4 col-lg-3" key={`${f.title}-${idx}`}>
                                                            <div style={{ border: "1px solid #eee", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
                                                                <div style={{ aspectRatio: "4 / 3", background: "#f7f7f7" }}>
                                                                    <img src={f.imageUrl} alt={f.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                                </div>
                                                                <div style={{ padding: 10 }}>
                                                                    <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.25 }}>{f.title}</div>
                                                                    {f.subtitle ? (
                                                                        <div className="text-muted" style={{ fontSize: 12, marginTop: 4 }}>{f.subtitle}</div>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : null}
                                            <div className="product__details-info table-responsive">
                                                <table className="table table-striped">
                                                    <tbody>
                                                        {specsList.length ? (
                                                            specsList.map((s, idx) => (
                                                                <tr key={`${s.key}-${idx}`}>
                                                                    <td className="add-info">{s.key}</td>
                                                                    <td className="add-info-list">{s.value}</td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td className="add-info" colSpan={2}>Bu ürün için henüz özellik eklenmemiş.</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {zoomOpen ? (
                    <div className="tp-lightbox" onClick={closeZoom} role="presentation">
                        <div className="tp-lightbox__inner" onClick={(e) => e.stopPropagation()} role="presentation">
                            <button type="button" className="tp-lightbox__close" onClick={closeZoom} aria-label="Kapat">×</button>
                            <img src={zoomUrl} alt="zoom" className="tp-lightbox__img" />
                        </div>
                    </div>
                ) : null}
            </Layout>
        </>
    )
}
