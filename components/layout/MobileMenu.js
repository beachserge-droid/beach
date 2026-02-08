'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
export default function MobileMenu() {
    const [isActive, setIsActive] = useState({
        status: false,
        key: "",
    })

    const handleClick = (key) => {
        if (isActive.key === key) {
            setIsActive({
                status: false,
            })
        } else {
            setIsActive({
                status: true,
                key,
            })
        }
    }

    const [productGroupItems, setProductGroupItems] = useState([
        { label: "Ürün Grupları", href: "#", isLabel: true },
        { label: "Jakuziler", href: "https://dusakabinantalya.com/", targetBlank: true },
        { label: "Duşakabinler", href: "https://dusakabinantalya.com/", targetBlank: true },
        { label: "Banyo Dolabı", href: "/shop" },
    ])
    const [mainItems, setMainItems] = useState([
        { label: "Menü", href: "#", isLabel: true },
        { label: "Alışveriş", href: "/shop" },
        { label: "Blog", href: "/blog" },
        { label: "İletişim", href: "/contact" },
    ])

    useEffect(() => {
        let cancelled = false
        const run = async () => {
            try {
                const [pgRes, mainRes] = await Promise.all([
                    fetch("/api/menus/mobile_product_groups"),
                    fetch("/api/menus/mobile_main"),
                ])

                const pgJson = pgRes.ok ? await pgRes.json().catch(() => null) : null
                const mainJson = mainRes.ok ? await mainRes.json().catch(() => null) : null

                if (!cancelled && pgJson?.ok && pgJson?.menu?.items) setProductGroupItems(pgJson.menu.items)
                if (!cancelled && mainJson?.ok && mainJson?.menu?.items) setMainItems(mainJson.menu.items)
            } catch {
                return
            }
        }

        run()
        return () => { cancelled = true }
    }, [])
    return (
        <>
            <div className="mobile-menu mean-container">
                <div className="mean-bar">
                    <Link href="#" className="meanmenu-reveal">
                        <span><span><span /></span></span>
                    </Link>
                    <nav className="mean-nav">
                        <ul>
                            {productGroupItems.map((item) =>
                                item.isLabel ? (
                                    <li key={`label-${item.label}`} className="tp-mobile-menu__label"><span>{item.label}</span></li>
                                ) : (
                                    <li key={`${item.href}-${item.label}`}>
                                        <Link
                                            href={item.href}
                                            target={item.targetBlank ? "_blank" : undefined}
                                            rel={item.targetBlank ? "noopener noreferrer" : undefined}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                )
                            )}
                            {mainItems.map((item, idx) =>
                                item.isLabel ? (
                                    <li key={`label2-${item.label}`} className="tp-mobile-menu__label"><span>{item.label}</span></li>
                                ) : (
                                    <li key={`${item.href}-${item.label}`} className={idx === mainItems.length - 1 ? "mean-last" : undefined}>
                                        <Link
                                            href={item.href}
                                            target={item.targetBlank ? "_blank" : undefined}
                                            rel={item.targetBlank ? "noopener noreferrer" : undefined}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>
                    </nav></div></div>

        </>
    )
}
