import Link from "next/link"
import "../admin.css"

export const metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

export default function AdminLayout({ children }) {
  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div className="admin-topbar__inner">
          <Link href="/admin" className="admin-brand">
            <span className="admin-brand__mark" aria-hidden="true" />
            <span>
              <div className="admin-brand__title">Yönetim Paneli</div>
              <div className="admin-brand__sub">CMS & Site Yönetimi</div>
            </span>
          </Link>
          <a href="/api/admin/logout" className="admin-btn">Çıkış</a>
        </div>
      </div>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar__section">
            <div className="admin-sidebar__title">Genel</div>
            <nav className="admin-nav">
              <Link href="/admin">
                <span>Dashboard</span>
                <span className="admin-nav__meta">Özet</span>
              </Link>
              <Link href="/admin/settings">
                <span>Site Ayarları</span>
                <span className="admin-nav__meta">Genel/SEO</span>
              </Link>
              <Link href="/admin/seo">
                <span>SEO Ayarları</span>
                <span className="admin-nav__meta">Kurallar</span>
              </Link>
            </nav>
          </div>

          <div className="admin-sidebar__section">
            <div className="admin-sidebar__title">İçerik</div>
            <nav className="admin-nav">
              <Link href="/admin/products">
                <span>Ürünler</span>
                <span className="admin-nav__meta">Katalog</span>
              </Link>
              <Link href="/admin/categories">
                <span>Kategoriler</span>
                <span className="admin-nav__meta">Hiyerarşi</span>
              </Link>
              <Link href="/admin/colors">
                <span>Renkler</span>
                <span className="admin-nav__meta">Filtre</span>
              </Link>
              <Link href="/admin/blog">
                <span>Blog</span>
                <span className="admin-nav__meta">Yazılar</span>
              </Link>
            </nav>
          </div>

          <div className="admin-sidebar__section">
            <div className="admin-sidebar__title">Yerleşim</div>
            <nav className="admin-nav">
              <Link href="/admin/menus">
                <span>Menüler</span>
                <span className="admin-nav__meta">Nav</span>
              </Link>
              <Link href="/admin/sliders">
                <span>Sliderlar</span>
                <span className="admin-nav__meta">Hero</span>
              </Link>
              <Link href="/admin/banners">
                <span>Bannerlar</span>
                <span className="admin-nav__meta">Görsel</span>
              </Link>
              <Link href="/admin/homepage-sections">
                <span>Anasayfa Bölümleri</span>
                <span className="admin-nav__meta">Kurgu</span>
              </Link>
            </nav>
          </div>

          <div className="admin-sidebar__section">
            <div className="admin-sidebar__title">Araçlar</div>
            <nav className="admin-nav">
              <Link href="/admin/redirects">
                <span>Redirects</span>
                <span className="admin-nav__meta">301</span>
              </Link>
              <Link href="/admin/leads">
                <span>Leads</span>
                <span className="admin-nav__meta">Form</span>
              </Link>
              <Link href="/admin/cms">
                <span>CMS</span>
                <span className="admin-nav__meta">Bloklar</span>
              </Link>
            </nav>
          </div>
        </aside>

        <main className="admin-main">{children}</main>
      </div>
    </div>
  )
}
