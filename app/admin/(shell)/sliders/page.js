import Link from "next/link"
import prisma from "@/lib/prisma"

export default async function AdminSlidersPage() {
  const sliders = await prisma.slider.findMany({
    orderBy: { key: "asc" },
    include: { _count: { select: { slides: true } } },
  })

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-toolbar__title">Sliderlar</h1>
          <div className="admin-muted" style={{ fontSize: 13, marginTop: 4 }}>
            Anasayfa slider içeriklerini buradan yönet.
          </div>
        </div>
        <div className="admin-toolbar__actions">
          <Link href="/admin/cms" className="admin-btn">CMS</Link>
        </div>
      </div>

      <div className="admin-table-wrap">
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Ad</th>
                <th className="is-right">Slide</th>
                <th className="is-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {sliders.map((s) => (
                <tr key={s.id}>
                  <td className="is-muted">{s.key}</td>
                  <td>{s.name}</td>
                  <td className="is-right">{s._count.slides}</td>
                  <td className="is-right">
                    <Link href={`/admin/sliders/${s.key}`} className="admin-btn">Düzenle</Link>
                  </td>
                </tr>
              ))}
              {sliders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="is-muted" style={{ padding: 18 }}>Henüz slider yok. /admin/cms üzerinden seed yap.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
