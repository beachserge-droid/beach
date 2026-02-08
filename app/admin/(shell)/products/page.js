import Link from "next/link"
import prisma from "@/lib/prisma"
import ImportProductsButton from "@/components/admin/ImportProductsButton"
import CleanupTestProductsButton from "@/components/admin/CleanupTestProductsButton"
import DeleteProductButton from "@/components/admin/DeleteProductButton"

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-toolbar__title">Ürünler</h1>
          <div className="admin-muted" style={{ fontSize: 13, marginTop: 4 }}>
            Son eklenen 100 ürün listelenir.
          </div>
        </div>
        <div className="admin-toolbar__actions">
          <ImportProductsButton />
          <CleanupTestProductsButton />
          <Link href="/admin/products/audit" className="admin-btn">Veri Denetimi</Link>
          <Link href="/admin/products/new" className="admin-btn">Yeni Ürün</Link>
        </div>
      </div>

      <div className="admin-table-wrap">
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Başlık</th>
                <th>Kategori</th>
                <th>Slug</th>
                <th>Yayın</th>
                <th className="is-right">Fiyat (Temsili)</th>
                <th className="is-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link className="admin-link" href={`/admin/products/${p.id}`}>{p.title}</Link>
                    <div className="admin-muted" style={{ fontSize: 12, marginTop: 3 }}>ID: {p.id}</div>
                  </td>
                  <td className="is-muted">{p.category?.name || "-"}</td>
                  <td className="is-muted">/{p.slug}</td>
                  <td>
                    {p.published ? (
                      <span className="admin-badge admin-badge--success">Açık</span>
                    ) : (
                      <span className="admin-badge admin-badge--danger">Kapalı</span>
                    )}
                  </td>
                  <td className="is-right">{Number(p.priceMax).toFixed(2)} TRY</td>
                  <td className="is-right">
                    <div className="admin-inline-actions">
                      <Link href={`/admin/products/${p.id}`} className="admin-btn">Düzenle</Link>
                      <DeleteProductButton id={p.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="is-muted" style={{ padding: 18 }}>
                    Henüz ürün yok.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
