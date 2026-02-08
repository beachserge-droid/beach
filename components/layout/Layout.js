
'use client'
import { useEffect, useState } from "react"
import BackToTop from '../elements/BackToTop'
import DataBg from "../elements/DataBg"
import Breadcrumb from './Breadcrumb'
import HeaderCart from "./HeaderCart"
import Sidebar from "./Sidebar"
import Footer1 from './footer/Footer1'
import Header5 from "./header/Header5"

export default function Layout({ breadcrumbTitle, children }) {
    const [scroll, setScroll] = useState(0)

    const [siteSettings, setSiteSettings] = useState(null)
    // Mobile Menu
    const [isMobileMenu, setMobileMenu] = useState(false)
    const handleMobileMenu = () => setMobileMenu(!isMobileMenu)

    // CartSidebar
    const [isCartSidebar, setCartSidebar] = useState(false)
    const handleCartSidebar = () => setCartSidebar(!isCartSidebar)

    useEffect(() => {
        const WOW = require('wowjs')
        window.wow = new WOW.WOW({
            live: false
        })
        window.wow.init()

        document.addEventListener("scroll", () => {
            const scrollCheck = window.scrollY > 100
            if (scrollCheck !== scroll) {
                setScroll(scrollCheck)
            }
        })
    }, [])

    useEffect(() => {
        let cancelled = false
        const run = async () => {
            try {
                const res = await fetch("/api/settings")
                if (!res.ok) return
                const json = await res.json().catch(() => null)
                if (!json?.ok) return
                if (!cancelled) setSiteSettings(json.settings || null)
            } catch {
                return
            }
        }

        run()
        return () => { cancelled = true }
    }, [])
    return (
        <>
            {/* <PageHead headTitle={headTitle} /> */}
            <DataBg />
            <Header5 settings={siteSettings} scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isCartSidebar={isCartSidebar} handleCartSidebar={handleCartSidebar} />
            <Sidebar isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} />
            <HeaderCart isCartSidebar={isCartSidebar} handleCartSidebar={handleCartSidebar} />
            <main>
                {breadcrumbTitle && <Breadcrumb breadcrumbTitle={breadcrumbTitle} />}

                {children}
            </main>

            <Footer1 settings={siteSettings} />

            <BackToTop />
        </>
    )
}
