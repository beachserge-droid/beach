import Link from "next/link"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

const formatNumber = (value) => {
  if (value === null || value === undefined) return "-"
  try {
    return new Intl.NumberFormat("tr-TR").format(Number(value))
  } catch {
    return String(value)
  }
}

export default async function AdminDashboardPage() {
  let stats = {
    products: null,
    categories: null,
    blogPosts: null,
    blogCategories: null,
    sliders: null,
    banners: null,
    bannerGroups: null,
    menus: null,
  }

  let dbError = false
  try {
    const [
      products,
      categories,
      blogPosts,
      blogCategories,
      sliders,
      bannerGroups,
      banners,
      menus,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.blogPost.count(),
      prisma.blogCategory.count(),
      prisma.slider.count(),
      prisma.bannerGroup.count(),
      prisma.banner.count(),
      prisma.menu.count(),
    ])

    stats = {
      products,
      categories,
      blogPosts,
      blogCategories,
      sliders,
      banners,
      bannerGroups,
      menus,
    }
  } catch {
    dbError = true
  }

  const cards = [
    { label: "Ürünler", value: formatNumber(stats.products), href: "/admin/products", meta: "Katalog" },
    { label: "Kategoriler", value: formatNumber(stats.categories), href: "/admin/categories", meta: "Hiyerarşi" },
    { label: "Blog Yazıları", value: formatNumber(stats.blogPosts), href: "/admin/blog", meta: "İçerik" },
    { label: "Blog Kategorileri", value: formatNumber(stats.blogCategories), href: "/admin/blog/categories", meta: "Taksonomi" },
    { label: "Sliderlar", value: formatNumber(stats.sliders), href: "/admin/sliders", meta: "Hero" },
    { label: "Banner Grupları", value: formatNumber(stats.bannerGroups), href: "/admin/banners", meta: "Görsel" },
    { label: "Bannerlar", value: formatNumber(stats.banners), href: "/admin/banners", meta: "Görsel" },
    { label: "Menüler", value: formatNumber(stats.menus), href: "/admin/menus", meta: "Nav" },
  ]

  const actions = [
    { label: "Ürün Ekle", href: "/admin/products/new" },
    { label: "Slider Yönet", href: "/admin/sliders" },
    { label: "Banner Yönet", href: "/admin/banners" },
    { label: "Blog Yaz", href: "/admin/blog/posts/new" },
    { label: "Site Ayarları", href: "/admin/settings" },
  ]

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 className="h4" style={{ marginBottom: 6 }}>Dashboard</h1>
          <div className="admin-muted" style={{ fontSize: 13 }}>
            Admin → API → Frontend zincirini buradan yönetebilirsin.
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {actions.map((a) => (
            <Link key={a.href} href={a.href} className="admin-btn">
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {dbError ? (
        <div className="admin-warn" style={{ marginTop: 14 }}>
          Veritabanı bağlantısı kurulamadı. İstatistikler gösterilemiyor.
        </div>
      ) : null}

      <div className="admin-dashboard-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 12, marginTop: 16 }}>
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            style={{
              gridColumn: "span 3",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div className="admin-card" style={{ height: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div className="admin-muted" style={{ fontSize: 12, letterSpacing: 0.2 }}>{c.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, marginTop: 6 }}>{c.value}</div>
                </div>
                <div className="admin-muted" style={{ fontSize: 12 }}>{c.meta}</div>
              </div>
            </div>
          </Link>
        ))}

        <div style={{ gridColumn: "span 6" }}>
          <div className="admin-card" style={{ height: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div className="admin-muted" style={{ fontSize: 12, letterSpacing: 0.2 }}>Leads</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 8 }}>Hazırlanıyor</div>
                <div className="admin-muted" style={{ fontSize: 13, marginTop: 6 }}>
                  Bu bölüm için DB modeli ve form entegrasyonu netleşince metrik ve liste ekranı ekleyeceğim.
                </div>
              </div>
              <Link href="/admin/leads" className="admin-btn">Ekrana Git</Link>
            </div>
          </div>
        </div>

        <div style={{ gridColumn: "span 6" }}>
          <div className="admin-card" style={{ height: "100%" }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Hızlı Kontroller</div>
            <div className="admin-muted" style={{ fontSize: 13, marginBottom: 12 }}>
              SEO odaklı yönetimde kritik noktalar.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              <Link href="/admin/settings" className="admin-btn" style={{ justifyContent: "center" }}>Site SEO</Link>
              <Link href="/admin/products" className="admin-btn" style={{ justifyContent: "center" }}>Ürün SEO</Link>
              <Link href="/admin/categories" className="admin-btn" style={{ justifyContent: "center" }}>Kategori Yapısı</Link>
              <Link href="/admin/redirects" className="admin-btn" style={{ justifyContent: "center" }}>Redirects</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1200px) {
          .admin-dashboard-grid > a { grid-column: span 6 !important; }
        }
        @media (max-width: 768px) {
          .admin-dashboard-grid > a { grid-column: span 12 !important; }
        }
      `}</style>
    </div>
  )
}
