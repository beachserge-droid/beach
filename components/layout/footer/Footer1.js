'use client'
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Footer1({ settings }) {
    const logoUrl = settings?.logoUrl || "/assets/img/logo/logo.png"
    const footerAbout = settings?.footerAbout || "Şık tasarım, üç boyutlu görünüm ve \n dekoratif detaylar bir arada.\n Her mekâna zarif bir dokunuş katmak için \n idealdir."
    const footerPhone = settings?.footerPhone || "980. 029. 666. 99"
    const footerWorkHours = settings?.footerWorkHours || "8:00 - 22:00"

    const socialFacebook = settings?.socialFacebook || "#"
    const socialInstagram = settings?.socialInstagram || "#"
    const socialX = settings?.socialX || "#"
    const socialYoutube = settings?.socialYoutube || "#"

    const [footerInfoItems, setFooterInfoItems] = useState([
        { label: "Müşteri Hizmetleri", href: "#" },
        { label: "Sık Sorulan Sorular", href: "#" },
        { label: "İletişim", href: "/contact" },
        { label: "Etkinlikler", href: "#" },
    ])

    const [footerAccountItems, setFooterAccountItems] = useState([
        { label: "Teslimat Bilgileri", href: "#" },
        { label: "Gizlilik Politikası", href: "#" },
        { label: "İndirimler", href: "#" },
        { label: "Şartlar ve Koşullar", href: "#" },
    ])

    useEffect(() => {
        let cancelled = false
        const run = async () => {
            try {
                const [infoRes, accRes] = await Promise.all([
                    fetch("/api/menus/footer_info"),
                    fetch("/api/menus/footer_account"),
                ])

                const infoJson = infoRes.ok ? await infoRes.json().catch(() => null) : null
                const accJson = accRes.ok ? await accRes.json().catch(() => null) : null

                if (!cancelled && infoJson?.ok && infoJson?.menu?.items) setFooterInfoItems(infoJson.menu.items)
                if (!cancelled && accJson?.ok && accJson?.menu?.items) setFooterAccountItems(accJson.menu.items)
            } catch {
                return
            }
        }

        run()
        return () => { cancelled = true }
    }, [])

    return (
        <>
            <footer>
                <div className="footer-area theme-bg pt-65">
                    <div className="container">
                        <div className="main-footer pb-15 mb-30">
                            <div className="row">
                                <div className="col-lg-3 col-md-4 col-sm-6">
                                    <div className="footer-widget footer-col-1 mb-40">
                                        <div className="footer-logo mb-30">
                                            <Link href="/"><img src={logoUrl} alt="logo" /></Link>
                                        </div>
                                        <div className="footer-content">
                                            <p style={{ whiteSpace: "pre-line" }}>{footerAbout}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-4 col-sm-6">
                                    <div className="footer-widget footer-col-2 ml-30 mb-40">
                                        <h4 className="footer-widget__title mb-30">Bilgilendirme</h4>
                                        <div className="footer-widget__links">
                                            <ul>
                                                {footerInfoItems.map((item) => (
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
                                <div className="col-lg-2 col-md-4 col-sm-6">
                                    <div className="footer-widget footer-col-3 mb-40">
                                        <h4 className="footer-widget__title mb-30">Hesabım</h4>
                                        <div className="footer-widget__links">
                                            <ul>
                                                {footerAccountItems.map((item) => (
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
                                <div className="col-lg-2 col-md-4 col-sm-6">
                                    <div className="footer-widget footer-col-4 mb-40">
                                        <h4 className="footer-widget__title mb-30">Sosyal Ağlar</h4>
                                        <div className="footer-widget__links">
                                            <ul>
                                                <li><Link href={socialFacebook}><i className="fab fa-facebook-f" />Facebook</Link></li>
                                                <li><Link href={socialInstagram}><i className="fab fa-instagram" />Instagram</Link></li>
                                                <li><Link href={socialX}><i className="fab fa-twitter" />X</Link></li>
                                                <li><Link href={socialYoutube}><i className="fab fa-youtube" />Youtube</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-4">
                                    <div className="footer-widget footer-col-5 mb-40">
                                        <h4 className="footer-widget__title mb-30">Bültene Katıl</h4>
                                        <p>Listeye katıl, ilk siparişinde %10 indirim kazan!</p>
                                        <div className="footer-widget__newsletter">
                                            <form action="#">
                                                <input type="email" placeholder="E-posta adresinizi girin" />
                                                <button className="footer-widget__fw-news-btn tpsecondary-btn">Abone Ol<i className="fal fa-long-arrow-right" /></button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="footer-cta pb-20">
                            <div className="row justify-content-between align-items-center">
                                <div className="col-xl-6 col-lg-4 col-md-4 col-sm-6">
                                    <div className="footer-cta__contact">
                                        <div className="footer-cta__icon">
                                            <i className="far fa-phone" />
                                        </div>
                                        <div className="footer-cta__text">
                                            <Link href={`/tel:${footerPhone}`}>{footerPhone}</Link>
                                            <span>Çalışma Saatleri: {footerWorkHours}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-6 col-lg-8 col-md-8 col-sm-6">
                                    <div className="footer-cta__source">
                                        <div className="footer-cta__source-content">
                                            <h4 className="footer-cta__source-title">Mobil Uygulamayı İndir</h4>
                                            <p>İlk alışverişinde %15 indirim</p>
                                        </div>
                                        <div className="footer-cta__source-thumb">
                                            <span className="app-badge"><img src="/assets/img/footer/f-google.jpg" alt="google" /></span>
                                            <span className="app-badge"><img src="/assets/img/footer/f-app.jpg" alt="app" /></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer-copyright footer-bg">
                        <div className="container">
                            <div className="row">
                                <div className="col-xl-6 col-lg-7 col-md-5 col-sm-12">
                                    <div className="footer-copyright__content">
                                        <span>Telif Hakkı {new Date().getFullYear()} <Link href="/">©Ninico</Link>. Tüm hakları saklıdır. Geliştiren:
                                            <Link href="https://themeforest.net/user/alithemes/portfolio"> AliThemes</Link>.</span>
                                    </div>
                                </div>
                                <div className="col-xl-6 col-lg-5 col-md-7 col-sm-12">
                                    <div className="footer-copyright__brand">
                                        <img src="/assets/img/footer/f-brand-icon-01.png" alt="footer-brand" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

        </>
    )
}
