'use client'
import Link from "next/link"
import MobileMenu from "./MobileMenu"
import { useEffect, useState } from "react"

export default function Sidebar({ isMobileMenu, handleMobileMenu }) {
    const [items, setItems] = useState([
        { label: "Alışveriş", href: "/shop" },
        { label: "Blog", href: "/blog" },
        { label: "Jakuziler", href: "https://dusakabinantalya.com/", targetBlank: true },
        { label: "Duşakabinler", href: "https://dusakabinantalya.com/", targetBlank: true },
        { label: "İletişim", href: "/contact" },
    ])

    useEffect(() => {
        let cancelled = false
        const run = async () => {
            try {
                const res = await fetch("/api/menus/sidebar_categories")
                if (!res.ok) return
                const json = await res.json().catch(() => null)
                if (!json?.ok || !json?.menu?.items) return
                if (!cancelled) setItems(json.menu.items)
            } catch {
                return
            }
        }

        run()
        return () => { cancelled = true }
    }, [])

    return (
        <>
            <div className={`tpsideinfo ${isMobileMenu ? "tp-sidebar-opened" : ""}`}>
                <button className="tpsideinfo__close" onClick={handleMobileMenu}>Close<i className="fal fa-times ml-10" /></button>
                <div className="tpsideinfo__search text-center pt-35">
                    <span className="tpsideinfo__search-title mb-20">What Are You Looking For?</span>
                    <form action="#">
                        <input type="text" placeholder="Search Products..." />
                        <button><i className="fal fa-search" /></button>
                    </form>
                </div>
                <div className="tpsideinfo__nabtab">
                    <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Menu</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Categories</button>
                        </li>
                    </ul>
                    <div className="tab-content" id="pills-tabContent">
                        <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex={0}>
                            <MobileMenu />
                        </div>
                        <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex={0}>
                            <div className="tpsidebar-categories">
                                <ul>
                                    {items.map((item) => (
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
                </div>
                <div className="tpsideinfo__account-link">
                    <Link href="/contact"><i className="fal fa-user" /> İletişim</Link>
                </div>
                <div className="tpsideinfo__wishlist-link">
                    <Link href="/wishlist" target="_parent"><i className="fal fa-heart" /> Wishlist</Link>
                </div>
            </div>
            <div className={`body-overlay ${isMobileMenu ? "opened" : ""}`} onClick={handleMobileMenu} />
        </>
    )
}
