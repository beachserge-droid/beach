'use client'
import Link from "next/link"
import { useEffect, useState } from "react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const swiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    slidesPerView: 1,
    spaceBetween: 30,
    autoplay: {
        delay: 2500,
    },

    // Navigation
    navigation: {
        nextEl: '.h1n',
        prevEl: '.h1p',
    },

    // Pagination
    pagination: {
        el: '.slider-pagination',
        clickable: true,
    },

}


export default function Slider5() {
    const [isToggled, setToggled] = useState(true)
    const handleToggle = () => setToggled(!isToggled)

    const [categoryItems, setCategoryItems] = useState([])

    const [serviceItems, setServiceItems] = useState([])

    const [slides, setSlides] = useState([])

    const [sideBanners, setSideBanners] = useState([])

    useEffect(() => {
        let cancelled = false
        const run = async () => {
            try {
                const [menuRes, sliderRes, bannersRes, servicesRes] = await Promise.all([
                    fetch("/api/menus/slider_categories"),
                    fetch("/api/sliders/home_slider"),
                    fetch("/api/banners/home_slider_side"),
                    fetch("/api/banners/home_services"),
                ])

                const menuJson = menuRes.ok ? await menuRes.json().catch(() => null) : null
                const sliderJson = sliderRes.ok ? await sliderRes.json().catch(() => null) : null
                const bannersJson = bannersRes.ok ? await bannersRes.json().catch(() => null) : null
                const servicesJson = servicesRes.ok ? await servicesRes.json().catch(() => null) : null

                if (!cancelled && menuJson?.ok && menuJson?.menu?.items) setCategoryItems(menuJson.menu.items)
                if (!cancelled && sliderJson?.ok && sliderJson?.slider?.slides) setSlides(sliderJson.slider.slides)
                if (!cancelled && bannersJson?.ok && bannersJson?.group?.banners) setSideBanners(bannersJson.group.banners)
                if (!cancelled && servicesJson?.ok && servicesJson?.group?.banners) setServiceItems(servicesJson.group.banners)
            } catch {
                return
            }
        }

        run()
        return () => { cancelled = true }
    }, [])

    const renderMultiline = (value) =>
        String(value || "")
            .split("\n")
            .map((part, idx) => (
                <span key={idx}>
                    {part}
                    {idx === String(value || "").split("\n").length - 1 ? null : <br />}
                </span>
            ))

    return (
        <>
            <section className="slider-area slider-bg-overlay pb-30 pt-60 ">
                <div className="container">
                    <div className="row justify-content-xl-end">
                        <div className="col-xl-2 d-none d-xl-block">
                            <div className="cat-menu__category category-style-five p-relative">
                                <a onClick={handleToggle} href="#"><i className="fal fa-bars" />Categories</a>
                                <div className="category-menu" style={{ display: `${isToggled ? "block" : "none"}` }}>
                                    <ul className="cat-menu__list">
                                        {categoryItems.map((item) => (
                                            <li key={`${item.href}-${item.label}`}>
                                                <Link
                                                    href={item.href}
                                                    target={item.targetBlank ? "_blank" : undefined}
                                                    rel={item.targetBlank ? "noopener noreferrer" : undefined}
                                                >
                                                    {item.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-7 col-lg-9 align-items-center">
                            <div className="tp-slider-area p-relative">
                                <div className="swiper-container slider-active">
                                    <Swiper {...swiperOptions}>
                                        {slides.map((slide, idx) => (
                                            <SwiperSlide key={idx}>
                                                <div className="tp-slide-item tpslider-item-5">
                                                    <div className="tp-slide-item__content">
                                                        <h4 className="tp-slide-item__sub-title">{slide.subtitle}</h4>
                                                        <h3 className="tp-slide-item__title mb-25">{renderMultiline(slide.title)}</h3>
                                                        <Link className="tp-slide-item__slide-btn tp-btn" href={slide.buttonHref || "/shop"}>
                                                            {slide.buttonLabel || "Shop Now"} <i className="fal fa-long-arrow-right" />
                                                        </Link>
                                                    </div>
                                                    <div className="tp-slide-item__img">
                                                        <img src={slide.imageUrl} alt="" />
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                                <div className="slider-pagination" />
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3">
                            <div className="row">
                                {sideBanners.map((b, idx) => (
                                    <div key={idx} className="col-lg-12 col-md-6 col-sm-6">
                                        <div className={`tpslider-banner ${b.variant === "slider_side_white" ? "white-banner" : ""} ${idx === 0 ? "mb-30 tpbnner-height-5" : ""}`.trim()}>
                                            <Link href={b.href || "/shop"}>
                                                <div className="tpslider-banner__img tpbannerthumb-5">
                                                    <img src={b.imageUrl} alt={b.alt || ""} />
                                                    <div className="tpslider-banner__content">
                                                        <span className="tpslider-banner__sub-title">{b.subtitle}</span>
                                                        <h4 className="tpslider-banner__title">{renderMultiline(b.title)}</h4>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="row pt-60">
                        {serviceItems.map((item, idx) => (
                            <div key={item.id || `${item.title}-${idx}`} className="col-lg-3 col-sm-6">
                                <div className="tpservicesitem tpservices-border d-flex align-items-center mb-30">
                                    <div className="tpservicesitem__icon mr-20">
                                        <img src={item.imageUrl} alt={item.alt || ""} className="fn__svg" />
                                    </div>
                                    <div className="tpservicesitem__content">
                                        <h4 className="tpservicesitem__title">{item.title}</h4>
                                        <p>{item.subtitle}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
