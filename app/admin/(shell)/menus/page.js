import Link from "next/link"
import prisma from "@/lib/prisma"

export default async function AdminMenusPage() {
  const menus = await prisma.menu.findMany({
    orderBy: { key: "asc" },
    include: { _count: { select: { items: true } } },
  })

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-toolbar__title">Menüler</h1>
          <div className="admin-muted" style={{ fontSize: 13, marginTop: 4 }}>
            Header/footer navigasyonlarını buradan yönet.
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
                <th className="is-right">Öğe</th>
                <th className="is-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {menus.map((m) => (
                <tr key={m.id}>
                  <td className="is-muted">{m.key}</td>
                  <td>{m.name}</td>
                  <td className="is-right">{m._count.items}</td>
                  <td className="is-right">
                    <Link href={`/admin/menus/${m.key}`} className="admin-btn">Düzenle</Link>
                  </td>
                </tr>
              ))}
              {menus.length === 0 ? (
                <tr>
                  <td colSpan={4} className="is-muted" style={{ padding: 18 }}>Henüz menü yok. /admin/cms üzerinden seed yap.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
