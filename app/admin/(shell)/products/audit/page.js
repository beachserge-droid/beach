import Link from "next/link"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

const yesNo = (v) => (v ? "Evet" : "Hayır")

export default async function AdminProductsAuditPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: true,
      specs: true,
      tags: { include: { tag: true } },
      infoBoxes: true,
      features: true,
    },
    orderBy: { createdAt: "desc" },
    take: 500,
  })

  const summary = products.reduce(
    (acc, p) => {
      const hasDescription = Boolean(String(p.description || "").trim())
      const hasSku = Boolean(String(p.sku || "").trim())
      const hasCategory = Boolean(p.categoryId)
      const hasMainImage = Boolean(String(p.imageMain || "").trim())
      const galleryCount = Array.isArray(p.images) ? p.images.length : 0
      const specsCount = Array.isArray(p.specs) ? p.specs.length : 0
      const tagsCount = Array.isArray(p.tags) ? p.tags.length : 0
      const infoBoxesCount = Array.isArray(p.infoBoxes) ? p.infoBoxes.length : 0
      const hasVideo = Boolean(String(p.videoUrl || "").trim())
      const featuresCount = Array.isArray(p.features) ? p.features.length : 0

      acc.total += 1
      if (!hasDescription) acc.missingDescription += 1
      if (!hasSku) acc.missingSku += 1
      if (!hasCategory) acc.missingCategory += 1
      if (!hasMainImage) acc.missingMainImage += 1
      if (galleryCount === 0) acc.missingGallery += 1
      if (specsCount === 0) acc.missingSpecs += 1
      if (tagsCount === 0) acc.missingTags += 1
      if (infoBoxesCount === 0) acc.missingInfoBoxes += 1
      if (!hasVideo) acc.missingVideo += 1
      if (featuresCount === 0) acc.missingFeatures += 1
      return acc
    },
    {
      total: 0,
      missingDescription: 0,
      missingSku: 0,
      missingCategory: 0,
      missingMainImage: 0,
      missingGallery: 0,
      missingSpecs: 0,
      missingTags: 0,
      missingInfoBoxes: 0,
      missingVideo: 0,
      missingFeatures: 0,
    }
  )

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <h1 className="h4 mb-0">Ürün Veri Denetimi</h1>
          <div className="text-muted" style={{ fontSize: 13 }}>
            Toplam: {summary.total} • Açıklama eksik: {summary.missingDescription} • SKU eksik: {summary.missingSku} • Kategori eksik: {summary.missingCategory}
          </div>
        </div>
        <div className="d-flex gap-2">
          <Link href="/admin/products" className="btn btn-outline-secondary btn-sm">Geri</Link>
          <Link href="/admin/cms" className="btn btn-outline-secondary btn-sm">CMS</Link>
        </div>
      </div>

      <div className="table-responsive mt-3">
        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th>Ürün</th>
              <th className="text-muted">Slug</th>
              <th>Kategori</th>
              <th>SKU</th>
              <th className="text-center">Açıklama</th>
              <th className="text-center">Ana Görsel</th>
              <th className="text-center">Galeri</th>
              <th className="text-center">Specs</th>
              <th className="text-center">Tags</th>
              <th className="text-center">Bilgi Kutusu</th>
              <th className="text-center">Video</th>
              <th className="text-center">Özellik Kartı</th>
              <th className="text-end">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const hasDescription = Boolean(String(p.description || "").trim())
              const hasSku = Boolean(String(p.sku || "").trim())
              const hasMainImage = Boolean(String(p.imageMain || "").trim())
              const hasVideo = Boolean(String(p.videoUrl || "").trim())
              const galleryCount = Array.isArray(p.images) ? p.images.length : 0
              const specsCount = Array.isArray(p.specs) ? p.specs.length : 0
              const tagsCount = Array.isArray(p.tags) ? p.tags.length : 0
              const infoBoxesCount = Array.isArray(p.infoBoxes) ? p.infoBoxes.length : 0
              const featuresCount = Array.isArray(p.features) ? p.features.length : 0

              return (
                <tr key={p.id}>
                  <td style={{ maxWidth: 280 }}>
                    <div style={{ fontWeight: 600 }}>{p.title}</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>ID: {p.id} • Yayın: {p.published ? "Açık" : "Kapalı"}</div>
                  </td>
                  <td className="text-muted">/{p.slug}</td>
                  <td>{p.category?.name || <span className="text-danger">Eksik</span>}</td>
                  <td>{hasSku ? p.sku : <span className="text-danger">Eksik</span>}</td>
                  <td className="text-center">{hasDescription ? "✅" : "❌"}</td>
                  <td className="text-center">{hasMainImage ? "✅" : "❌"}</td>
                  <td className="text-center">{galleryCount}</td>
                  <td className="text-center">{specsCount}</td>
                  <td className="text-center">{tagsCount}</td>
                  <td className="text-center">{infoBoxesCount}</td>
                  <td className="text-center">{hasVideo ? "✅" : "❌"}</td>
                  <td className="text-center">{featuresCount}</td>
                  <td className="text-end">
                    <div className="d-inline-flex gap-2">
                      <Link href={`/admin/products/${p.id}`} className="btn btn-outline-secondary btn-sm">Düzenle</Link>
                      <Link href={`/shop/${encodeURIComponent(p.slug || String(p.id))}`} className="btn btn-outline-primary btn-sm" target="_blank">Gör</Link>
                    </div>
                  </td>
                </tr>
              )
            })}
            {products.length === 0 ? (
              <tr>
                <td colSpan={13} className="text-muted py-4">Ürün yok.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="text-muted" style={{ fontSize: 13 }}>
        <div>Notlar:</div>
        <div>- "Additional information" tabı sadece DB’deki Specs (Özellikler) ile dolar.</div>
        <div>- Bilgi kutuları ürüne özel girilmezse global banner grubundan (product_info_boxes) fallback gelir.</div>
      </div>
    </div>
  )
}
