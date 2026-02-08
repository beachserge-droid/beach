import SeedCmsButton from "@/components/admin/SeedCmsButton"
import prisma from "@/lib/prisma"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminCmsPage() {
  const [menuCount, sliderCount, bannerGroupCount] = await Promise.all([
    prisma.menu.count(),
    prisma.slider.count(),
    prisma.bannerGroup.count(),
  ])

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-toolbar__title">CMS Yönetimi</h1>
          <div className="admin-muted" style={{ fontSize: 13, marginTop: 4 }}>
            Navigasyon ve görsel alanların kurulum/denetim ekranı.
          </div>
        </div>
        <div className="admin-toolbar__actions">
          <SeedCmsButton />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 12, marginTop: 12 }}>
        <div style={{ gridColumn: "span 4" }}>
          <div className="admin-card">
            <div className="admin-muted" style={{ fontSize: 12, letterSpacing: 0.2 }}>Menüler</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{menuCount}</div>
            <div style={{ marginTop: 12 }}>
              <Link href="/admin/menus" className="admin-btn">Yönet</Link>
            </div>
          </div>
        </div>
        <div style={{ gridColumn: "span 4" }}>
          <div className="admin-card">
            <div className="admin-muted" style={{ fontSize: 12, letterSpacing: 0.2 }}>Sliderlar</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{sliderCount}</div>
            <div style={{ marginTop: 12 }}>
              <Link href="/admin/sliders" className="admin-btn">Yönet</Link>
            </div>
          </div>
        </div>
        <div style={{ gridColumn: "span 4" }}>
          <div className="admin-card">
            <div className="admin-muted" style={{ fontSize: 12, letterSpacing: 0.2 }}>Banner Grupları</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{bannerGroupCount}</div>
            <div style={{ marginTop: 12 }}>
              <Link href="/admin/banners" className="admin-btn">Yönet</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-muted" style={{ fontSize: 13, marginTop: 12 }}>
        Not: İlk kurulumda seed butonu, sistemde olmayan CMS içeriklerini oluşturur.
      </div>
    </div>
  )
}
