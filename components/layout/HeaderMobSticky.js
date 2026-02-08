'use client'
import Link from "next/link"
import CartShow from "../elements/CartShow"

export default function HeaderMobSticky({ settings, scroll, isMobileMenu, handleMobileMenu, isCartSidebar, handleCartSidebar }) {
    const logoUrl = settings?.logoUrl || "/assets/img/logo/logo.png"

    return (
        <>
            <div id="header-mob-sticky" className={`tp-md-lg-header d-md-none pt-20 pb-20 ${scroll ? "header-sticky" : ""}`}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-3 d-flex align-items-center">
                            <div className="header-canvas flex-auto">
                                <button className="tp-menu-toggle" onClick={handleMobileMenu}><i className="far fa-bars" /></button>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="logo text-center">
                                <Link href="/"><img src={logoUrl} alt="logo" /></Link>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="header-meta-info d-flex align-items-center justify-content-end ml-25">
                                <div className="header-meta m-0 d-flex align-items-center">
                                    <div className="header-meta__social d-flex align-items-center">
                                        <button className="header-cart p-relative tp-cart-toggle" onClick={handleCartSidebar}>
                                            <i className="fal fa-shopping-cart" />
                                            <CartShow />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
