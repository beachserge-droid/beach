import Link from "next/link"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function AdminBannersPage() {
  const groups = await prisma.bannerGroup.findMany({
    orderBy: { key: "asc" },
    include: { _count: { select: { banners: true } } },
  })

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-toolbar__title">Banner Grupları</h1>
          <div className="admin-muted" style={{ fontSize: 13, marginTop: 4 }}>
            Banner gruplarını ve görsellerini buradan yönet.
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
                <th className="is-right">Banner</th>
                <th className="is-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g.id}>
                  <td className="is-muted">{g.key}</td>
                  <td>{g.name}</td>
                  <td className="is-right">{g._count.banners}</td>
                  <td className="is-right">
                    <Link href={`/admin/banners/${g.key}`} className="admin-btn">Düzenle</Link>
                  </td>
                </tr>
              ))}
              {groups.length === 0 ? (
                <tr>
                  <td colSpan={4} className="is-muted" style={{ padding: 18 }}>Henüz banner grubu yok. /admin/cms üzerinden seed yap.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
