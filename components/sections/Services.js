"use client"

import { useEffect, useState } from "react"

export default function Services() {
    const [items, setItems] = useState([
        { imageUrl: "/assets/img/svg/services01.svg", alt: "Free shipping", title: "Free shipping", subtitle: "Free shipping on orders over." },
        { imageUrl: "/assets/img/svg/services02.svg", alt: "Free Returns", title: "Free Returns", subtitle: "30-days free return policy" },
        { imageUrl: "/assets/img/svg/services03.svg", alt: "Secured Payments", title: "Secured Payments", subtitle: "We accept all major credit cards" },
        { imageUrl: "/assets/img/svg/services04.svg", alt: "Customer Service", title: "Customer Service", subtitle: "Top notch customer setvice" },
    ])

    useEffect(() => {
        let cancelled = false
        const run = async () => {
            try {
                const res = await fetch("/api/banners/services_section")
                if (!res.ok) return
                const json = await res.json().catch(() => null)
                if (!json?.ok || !json?.group?.banners) return
                if (!cancelled) setItems(json.group.banners)
            } catch {
                return
            }
        }

        run()
        return () => { cancelled = true }
    }, [])

    return (
        <>
            <section className="services-area pt-70">
                <div className="container">
                    <div className="row services-gx-item">
                        {items.map((item, idx) => (
                            <div key={item.id || `${item.title}-${idx}`} className="col-lg-3 col-sm-6">
                                <div className="tpservicesitem d-flex align-items-center mb-30">
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
