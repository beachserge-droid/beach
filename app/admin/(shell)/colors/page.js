'use client'

import { useEffect, useMemo, useState } from "react"

const slugify = (value) =>
  (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")

export default function AdminColorsPage() {
  const [colors, setColors] = useState([])
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [hex, setHex] = useState("")
  const [sortOrder, setSortOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const autoSlug = useMemo(() => slugify(name), [name])

  const load = async () => {
    const res = await fetch("/api/admin/colors")
    const json = await res.json().catch(() => null)
    if (!res.ok || !json?.ok) throw new Error("load_failed")
    setColors(json.colors || [])
  }

  useEffect(() => {
    load().catch(() => {})
  }, [])

  const onCreate = async (e) => {
    e.preventDefault()
    setError("")

    const finalName = name.trim()
    const finalSlug = (slug || autoSlug).trim()
    if (!finalName) return setError("Renk adı zorunlu.")

    setLoading(true)
    try {
      const res = await fetch("/api/admin/colors", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: finalName,
          slug: finalSlug,
          hex: hex || null,
          sortOrder: Number(sortOrder || 0),
          isActive,
        }),
      })

      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.ok) throw new Error("create_failed")

      setName("")
      setSlug("")
      setHex("")
      setSortOrder(0)
      setIsActive(true)
      await load()
    } catch {
      setError("Renk oluşturulamadı. (Slug zaten var olabilir)")
    } finally {
      setLoading(false)
    }
  }

  const updateColor = async (id, patch) => {
    const res = await fetch(`/api/admin/colors/${encodeURIComponent(String(id))}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    })
    const json = await res.json().catch(() => null)
    if (!res.ok || !json?.ok) throw new Error(json?.error || "update_failed")
    return json.color
  }

  const deleteColor = async (id) => {
    const res = await fetch(`/api/admin/colors/${encodeURIComponent(String(id))}`, {
      method: "DELETE",
    })
    const json = await res.json().catch(() => null)
    if (!res.ok || !json?.ok) throw new Error(json?.error || "delete_failed")
  }

  const onRowSave = (id) => async () => {
    setError("")
    try {
      const row = colors.find((c) => c.id === id)
      if (!row) return

      await updateColor(id, {
        name: row.name,
        slug: row.slug,
        hex: row.hex || null,
        sortOrder: Number(row.sortOrder || 0),
        isActive: row.isActive !== false,
      })

      await load()
    } catch {
      setError("Renk kaydedilemedi.")
    }
  }

  const onRowDelete = (id) => async () => {
    const ok = window.confirm("Rengi silmek istiyor musun?")
    if (!ok) return
    setError("")
    try {
      await deleteColor(id)
      await load()
    } catch {
      setError("Renk silinemedi.")
    }
  }

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-toolbar__title">Renkler</h1>
          <div className="admin-muted" style={{ fontSize: 13, marginTop: 4 }}>
            Ürün filtrelerinde kullanılan renkleri yönet.
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 12, marginTop: 12 }}>
        <div style={{ gridColumn: "span 5" }}>
          <div className="admin-card">
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
              <div style={{ fontWeight: 800 }}>Yeni Renk</div>
              <div className="admin-muted" style={{ fontSize: 12 }}>Oluştur</div>
            </div>

            {error ? <div className="admin-alert" style={{ marginBottom: 12 }}>{error}</div> : null}

            <form onSubmit={onCreate}>
              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">Ad</label>
                <input className="admin-input" value={name} onChange={(e) => {
                  setName(e.target.value)
                  if (!slug) setSlug(slugify(e.target.value))
                }} required />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">Slug</label>
                <input className="admin-input" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder={autoSlug} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">Hex (opsiyonel)</label>
                <input className="admin-input" value={hex} onChange={(e) => setHex(e.target.value)} placeholder="#000000" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 10, marginBottom: 12 }}>
                <div style={{ gridColumn: "span 6" }}>
                  <label className="admin-label">Sıralama</label>
                  <input className="admin-input" type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value || 0))} />
                </div>
                <div style={{ gridColumn: "span 6" }}>
                  <label className="admin-label">Aktif</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                    <input className="admin-checkbox" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} id="colorActiveNew" />
                    <label htmlFor="colorActiveNew" className="admin-muted" style={{ fontSize: 13 }}>Yayında</label>
                  </div>
                </div>
              </div>

              <button className="admin-primary" type="submit" disabled={loading}>
                {loading ? "Kaydediliyor..." : "Ekle"}
              </button>
            </form>
          </div>
        </div>

        <div style={{ gridColumn: "span 7" }}>
          <div className="admin-table-wrap">
            <div style={{ padding: 14, borderBottom: "1px solid rgba(15, 17, 21, 0.08)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
              <div style={{ fontWeight: 800 }}>Liste</div>
              <div className="admin-muted" style={{ fontSize: 12 }}>Toplam: {colors.length}</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ad</th>
                    <th>Slug</th>
                    <th>Hex</th>
                    <th className="is-right">Sıra</th>
                    <th>Aktif</th>
                    <th className="is-right">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {colors.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <input className="admin-input" value={c.name || ""} onChange={(e) => setColors((prev) => prev.map((x) => x.id === c.id ? { ...x, name: e.target.value } : x))} style={{ padding: "8px 10px", borderRadius: 12, minWidth: 160 }} />
                      </td>
                      <td>
                        <input className="admin-input" value={c.slug || ""} onChange={(e) => setColors((prev) => prev.map((x) => x.id === c.id ? { ...x, slug: slugify(e.target.value) } : x))} style={{ padding: "8px 10px", borderRadius: 12, minWidth: 160 }} />
                      </td>
                      <td style={{ width: 200 }}>
                        <input className="admin-input" value={c.hex || ""} onChange={(e) => setColors((prev) => prev.map((x) => x.id === c.id ? { ...x, hex: e.target.value } : x))} style={{ padding: "8px 10px", borderRadius: 12, width: 160 }} />
                      </td>
                      <td className="is-right" style={{ width: 110 }}>
                        <input className="admin-input" type="number" value={Number(c.sortOrder || 0)} onChange={(e) => setColors((prev) => prev.map((x) => x.id === c.id ? { ...x, sortOrder: Number(e.target.value || 0) } : x))} style={{ padding: "8px 10px", borderRadius: 12, width: 90, textAlign: "right" }} />
                      </td>
                      <td style={{ width: 110 }}>
                        <input className="admin-checkbox" type="checkbox" checked={c.isActive !== false} onChange={(e) => setColors((prev) => prev.map((x) => x.id === c.id ? { ...x, isActive: e.target.checked } : x))} aria-label="Aktif" />
                      </td>
                      <td className="is-right" style={{ width: 220 }}>
                        <div className="admin-inline-actions">
                          <button type="button" className="admin-btn" onClick={onRowSave(c.id)} disabled={loading}>Kaydet</button>
                          <button type="button" className="admin-btn admin-btn--danger" onClick={onRowDelete(c.id)} disabled={loading}>Sil</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {colors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="is-muted" style={{ padding: 18 }}>Henüz renk yok.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
