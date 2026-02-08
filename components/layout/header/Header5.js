'use client'
import Link from "next/link"
import { useEffect, useState } from "react"
import HeaderMobSticky from "../HeaderMobSticky"
import HeaderSticky from "../HeaderSticky"
import HeaderTabSticky from "../HeaderTabSticky"

export default function Header5({ settings, scroll, isMobileMenu, handleMobileMenu, isCartSidebar, handleCartSidebar }) {
    const phone = settings?.headerPhone || "+90 242 345 52 44"
    const email = settings?.headerEmail || "info@royaldusakabin.com"
    const logoUrl = settings?.logoUrl || "/assets/img/logo/logo.png"

    const [topMenuItems, setTopMenuItems] = useState([
        { label: "Jakuziler", href: "https://dusakabinantalya.com/", targetBlank: true },
        { label: "Duşakabinler", href: "https://dusakabinantalya.com/", targetBlank: true },
        { label: "Banyo Dolabı", href: "/shop", targetBlank: false },
    ])
    const [mainMenuItems, setMainMenuItems] = useState([
        { label: "Alışveriş", href: "/shop" },
        { label: "Blog", href: "/blog" },
        { label: "İletişim", href: "/contact" },
    ])

    useEffect(() => {
        let cancelled = false
        const run = async () => {
            try {
                const [topRes, mainRes] = await Promise.all([
                    fetch("/api/menus/header_top"),
                    fetch("/api/menus/header_main"),
                ])

                const topJson = topRes.ok ? await topRes.json().catch(() => null) : null
                const mainJson = mainRes.ok ? await mainRes.json().catch(() => null) : null

                if (!cancelled && topJson?.ok && topJson?.menu?.items) {
                    setTopMenuItems(topJson.menu.items)
                }

                if (!cancelled && mainJson?.ok && mainJson?.menu?.items) {
                    setMainMenuItems(mainJson.menu.items)
                }
            } catch {
                return
            }
        }

        run()
        return () => { cancelled = true }
    }, [])

    return (
        <>
            <style jsx global>{`
                /* Premium Header Styles */
                #header-sticky .header-cart,
                #header-tab-sticky .header-cart,
                #header-mob-sticky .header-cart {
                    display: none !important;
                }
                
                /* Premium Header Top - Grey Background */
                .header-top {
                    background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 50%, #e8e8e8 100%);
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
                    position: relative;
                    z-index: 1000;
                    border-bottom: 2px solid #ff0000;
                }
                
                .header-top::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #ff0000, transparent);
                }
                
                .header-top-nav {
                    display: flex;
                    align-items: center;
                    gap: 0;
                }
                
                .header-top-nav a {
                    color: #333;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 600;
                    padding: 12px 24px;
                    border-radius: 0;
                    transition: all 0.3s ease;
                    background: transparent;
                    border: none;
                    border-bottom: 3px solid transparent;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .header-top-nav a:hover {
                    color: #ff0000;
                    background: rgba(255, 0, 0, 0.08);
                    border-bottom-color: #ff0000;
                }
                
                .header-top-contact {
                    display: flex;
                    align-items: center;
                    gap: 0;
                }
                
                .header-top-contact__item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #333;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 600;
                    padding: 12px 24px;
                    border-radius: 0;
                    transition: all 0.3s ease;
                    background: transparent;
                    border: none;
                    border-bottom: 3px solid transparent;
                }
                
                .header-top-contact__item:hover {
                    color: #ff0000;
                    background: rgba(255, 0, 0, 0.08);
                    border-bottom-color: #ff0000;
                }
                
                .header-top-contact__item i {
                    font-size: 16px;
                    color: #ff0000;
                    width: 20px;
                    text-align: center;
                    font-weight: 600;
                }
                
                /* Main Header Premium Styles */
                #header-sticky {
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(20px);
                    box-shadow: 0 4px 30px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.05);
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                    transition: all 0.4s ease;
                }
                
                #header-sticky:hover {
                    box-shadow: 0 8px 40px rgba(0,0,0,0.15);
                }
                
                .logo {
                    position: relative;
                    transition: transform 0.3s ease;
                }
                
                .logo:hover {
                    transform: scale(1.02);
                }
                
                .logo img {
                    max-height: 55px;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                }
                
                /* Premium Navigation - Rectangular Sharp */
                .tp-main-nav ul {
                    display: flex;
                    align-items: center;
                    gap: 0;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }
                
                .tp-main-nav ul li {
                    position: relative;
                }
                
                .tp-main-nav ul li a {
                    display: block;
                    color: #333;
                    text-decoration: none;
                    font-size: 15px;
                    font-weight: 600;
                    padding: 14px 28px;
                    border-radius: 0;
                    transition: all 0.25s ease;
                    position: relative;
                    overflow: visible;
                    border-bottom: 3px solid transparent;
                }
                
                .tp-main-nav ul li a:hover {
                    color: #ff0000;
                    background: rgba(255, 0, 0, 0.08);
                    border-bottom-color: #ff0000;
                }
                
                .tp-main-nav ul li a::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    width: 0;
                    height: 3px;
                    background: #ff0000;
                    transition: all 0.3s ease;
                    transform: translateX(-50%);
                }
                
                .tp-main-nav ul li a:hover::after {
                    width: 80%;
                }
                
                /* Premium Search Bar */
                .header-search-bar-5 {
                    position: relative;
                }
                
                .search-info-5 {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                
                .tp-header-search-input {
                    width: 280px;
                    height: 48px;
                    padding: 0 20px 0 50px;
                    border: 2px solid #e0e0e0;
                    border-radius: 30px;
                    font-size: 14px;
                    font-weight: 500;
                    background: #f8f8f8;
                    transition: all 0.3s ease;
                    outline: none;
                }
                
                .tp-header-search-input:focus {
                    border-color: #ff0000;
                    background: #fff;
                    box-shadow: 0 4px 20px rgba(255, 0, 0, 0.15);
                    width: 320px;
                }
                
                .tp-header-search-input::placeholder {
                    color: #999;
                }
                
                .header-search-icon-5 {
                    position: absolute;
                    left: 18px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: #ff0000;
                    font-size: 16px;
                    cursor: pointer;
                    padding: 0;
                    transition: all 0.3s ease;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .search-info-5:hover .header-search-icon-5 {
                    transform: translateY(-50%) scale(1.1);
                }
                
                /* Responsive */
                @media (max-width: 1199px) {
                    .tp-header-search-input {
                        width: 220px;
                    }
                    .tp-header-search-input:focus {
                        width: 240px;
                    }
                }
            `}</style>
            <header>
                <div className="header-top">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 d-none d-lg-block">
                                <div className="headertoplag">
                                    <div className="header-top-nav">
                                        {topMenuItems.map((item) => (
                                            <Link
                                                key={`${item.href}-${item.label}`}
                                                href={item.href}
                                                target={item.targetBlank ? "_blank" : undefined}
                                                rel={item.targetBlank ? "noopener noreferrer" : undefined}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="header-top-contact text-end">
                                    <a className="header-top-contact__item" href={`tel:${phone}`}>
                                        <i className="fal fa-phone" />
                                        <span>Destek {phone}</span>
                                    </a>
                                    <a className="header-top-contact__item" href={`mailto:${email}`}>
                                        <i className="fal fa-envelope" />
                                        <span>{email}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="header-sticky" className="logo-area d-none d-xl-block mainmenu-5">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-xl-2 col-lg-3">
                                <div className="logo">
                                    <Link href="/"><img src={logoUrl} alt="logo" /></Link>
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6">
                                <div className="main-menu">
                                    <nav id="mobile-menu" className="tp-main-nav">
                                        <ul>
                                            {mainMenuItems.map((item) => (
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
                                    </nav>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-9">
                                <div className="header-meta-info d-flex align-items-center justify-content-end">
                                    <div className="header-meta__search-5 ml-25">
                                        <div className="header-search-bar-5">
                                            <form action="#">
                                                <div className="search-info-5 p-relative">
                                                    <button className="header-search-icon-5"><i className="fal fa-search" /></button>
                                                    <input className="tp-header-search-input" type="text" placeholder="Arama..." />
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <HeaderSticky settings={settings} menuItems={mainMenuItems} scroll={scroll} isCartSidebar={isCartSidebar} handleCartSidebar={handleCartSidebar} />
            <HeaderTabSticky settings={settings} scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isCartSidebar={isCartSidebar} handleCartSidebar={handleCartSidebar} />
            <HeaderMobSticky settings={settings} scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isCartSidebar={isCartSidebar} handleCartSidebar={handleCartSidebar} />
        </>
    )
}
