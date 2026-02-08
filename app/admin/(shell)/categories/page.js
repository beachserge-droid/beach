'use client'

import { useEffect, useMemo, useState } from "react"
import FixCategorySlugsButton from "@/components/admin/FixCategorySlugsButton"

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

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [parentId, setParentId] = useState("")
  const [sortOrder, setSortOrder] = useState(0)
  const [iconImage, setIconImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const [childDrafts, setChildDrafts] = useState({})
  const [newChildByParent, setNewChildByParent] = useState({})

  const autoSlug = useMemo(() => slugify(name), [name])

  const load = async () => {
    const res = await fetch("/api/admin/categories")
    const json = await res.json()
    if (!res.ok || !json?.ok) throw new Error("load_failed")
    setCategories(json.categories || [])
  }

  useEffect(() => {
    load().catch(() => {})
  }, [])

  const onCreate = async (e) => {
    e.preventDefault()
    setError("")
    const finalName = name.trim()
    const finalSlug = (slug || autoSlug).trim()
    if (!finalName) return setError("Kategori adı zorunlu.")
    if (!finalSlug) return setError("Slug zorunlu.")

    setLoading(true)
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: finalName,
          slug: finalSlug,
          parentId: parentId ? Number(parentId) : null,
          sortOrder: Number(sortOrder || 0),
          iconImage: iconImage || null,
        }),
      })

      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.ok) throw new Error("create_failed")

      setName("")
      setSlug("")
      setParentId("")
      setSortOrder(0)
      setIconImage("")
      await load()
    } catch {
      setError("Kategori oluşturulamadı. (Slug zaten var olabilir)")
    } finally {
      setLoading(false)
    }
  }

  const uploadFile = async (file) => {
    const form = new FormData()
    form.append("file", file)

    const res = await fetch("/api/admin/upload", { method: "POST", body: form })
    if (!res.ok) throw new Error("upload_failed")
    const json = await res.json()
    if (!json?.ok || !json?.url) throw new Error("upload_failed")
    return json.url
  }

  const onPickNewIcon = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError("")
    try {
      const url = await uploadFile(file)
      setIconImage(url)
    } catch {
      setError("İkon yükleme başarısız.")
    } finally {
      setUploading(false)
    }
  }

  const updateCategory = async (id, patch) => {
    const res = await fetch(`/api/admin/categories/${encodeURIComponent(String(id))}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    })
    const json = await res.json().catch(() => null)
    if (!res.ok || !json?.ok) throw new Error(json?.error || "update_failed")
    return json.category
  }

  const deleteCategory = async (id) => {
    const res = await fetch(`/api/admin/categories/${encodeURIComponent(String(id))}`, {
      method: "DELETE",
    })
    const json = await res.json().catch(() => null)
    if (!res.ok || !json?.ok) throw new Error(json?.error || "delete_failed")
  }

  const onRowSave = (id) => async () => {
    setError("")
    try {
      const row = categories.find((c) => c.id === id)
      if (!row) return

      await updateCategory(id, {
        name: row.name,
        slug: row.slug,
        parentId: row.parentId ? Number(row.parentId) : null,
        sortOrder: Number(row.sortOrder || 0),
        iconImage: row.iconImage || null,
      })
      await load()
    } catch {
      setError("Kategori kaydedilemedi.")
    }
  }

  const onRowDelete = (id) => async () => {
    const ok = window.confirm("Kategoriyi silmek istiyor musun?")
    if (!ok) return
    setError("")
    try {
      await deleteCategory(id)
      await load()
    } catch {
      setError("Kategori silinemedi.")
    }
  }

  const onPickRowIcon = (id) => async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError("")
    try {
      const url = await uploadFile(file)
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, iconImage: url } : c)))
    } catch {
      setError("İkon yükleme başarısız.")
    } finally {
      setUploading(false)
    }
  }

  const getParentName = (id) => categories.find((c) => c.id === id)?.name

  const createChildCategory = async (parentIdNum, childName) => {
    const finalName = String(childName || "").trim()
    if (!parentIdNum || !finalName) return

    setError("")
    setUploading(true)
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: finalName,
          slug: slugify(finalName),
          parentId: Number(parentIdNum),
          sortOrder: 0,
          iconImage: null,
        }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.ok) throw new Error("create_child_failed")
      await load()
    } catch {
      setError("Alt kategori oluşturulamadı.")
    } finally {
      setUploading(false)
    }
  }

  const saveChildCategory = async (id) => {
    const row = categories.find((c) => c.id === id)
    if (!row) return
    setError("")
    try {
      await updateCategory(id, {
        name: row.name,
        slug: row.slug,
        parentId: row.parentId ? Number(row.parentId) : null,
        sortOrder: Number(row.sortOrder || 0),
        iconImage: row.iconImage || null,
      })
      await load()
    } catch {
      setError("Alt kategori kaydedilemedi.")
    }
  }

  const deleteChildCategory = async (id) => {
    const ok = window.confirm("Alt kategoriyi silmek istiyor musun?")
    if (!ok) return
    setError("")
    try {
      await deleteCategory(id)
      await load()
    } catch {
      setError("Alt kategori silinemedi.")
    }
  }

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-toolbar__title">Kategoriler</h1>
          <div className="admin-muted" style={{ fontSize: 13, marginTop: 4 }}>
            Kategori hiyerarşisini ve alt ölçüleri buradan yönetebilirsin.
          </div>
        </div>
        <div className="admin-toolbar__actions">
          <FixCategorySlugsButton />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 12, marginTop: 12 }}>
        <div style={{ gridColumn: "span 5" }}>
          <div className="admin-card">
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
              <div style={{ fontWeight: 800 }}>Yeni Kategori</div>
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
                <input className="admin-input" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder={autoSlug} required />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">Üst Kategori (opsiyonel)</label>
                <select className="admin-input" value={parentId} onChange={(e) => setParentId(e.target.value)}>
                  <option value="">Yok</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 10, marginBottom: 12 }}>
                <div style={{ gridColumn: "span 6" }}>
                  <label className="admin-label">Sıralama</label>
                  <input className="admin-input" type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value || 0))} />
                </div>
                <div style={{ gridColumn: "span 6" }}>
                  <label className="admin-label">İkon</label>
                  <input className="admin-input" type="file" accept="image/*" onChange={onPickNewIcon} disabled={uploading} />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <input className="admin-input" value={iconImage} onChange={(e) => setIconImage(e.target.value)} placeholder="/uploads/... veya icon dosya adı" />
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
              <div className="admin-muted" style={{ fontSize: 12 }}>
                Toplam: {categories.length}
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ad</th>
                    <th>Slug</th>
                    <th>Üst</th>
                    <th>İkon</th>
                    <th className="is-right">Sıra</th>
                    <th className="is-right">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <input
                          className="admin-input"
                          value={c.name || ""}
                          onChange={(e) => setCategories((prev) => prev.map((x) => x.id === c.id ? { ...x, name: e.target.value } : x))}
                          style={{ padding: "8px 10px", borderRadius: 12 }}
                        />

                        {!c.parentId ? (
                          <div style={{ marginTop: 12 }}>
                            <div className="admin-muted" style={{ fontSize: 12, marginBottom: 8 }}>Alt kategoriler / Ölçüler</div>

                            {(categories.filter((x) => String(x.parentId || "") === String(c.id)).length ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {categories
                                  .filter((x) => String(x.parentId || "") === String(c.id))
                                  .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0) || String(a.name || "").localeCompare(String(b.name || ""), "tr"))
                                  .map((ch) => (
                                    <div key={ch.id} style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                                      <input
                                        className="admin-input"
                                        value={ch.name || ""}
                                        onChange={(e) => setCategories((prev) => prev.map((x) => x.id === ch.id ? { ...x, name: e.target.value } : x))}
                                        placeholder="Örn: 80x80"
                                        style={{ padding: "8px 10px", borderRadius: 12, minWidth: 180 }}
                                      />
                                      <input
                                        className="admin-input"
                                        value={ch.slug || ""}
                                        onChange={(e) => setCategories((prev) => prev.map((x) => x.id === ch.id ? { ...x, slug: slugify(e.target.value) } : x))}
                                        placeholder="slug"
                                        style={{ padding: "8px 10px", borderRadius: 12, width: 220 }}
                                      />
                                      <input
                                        className="admin-input"
                                        type="number"
                                        value={Number(ch.sortOrder || 0)}
                                        onChange={(e) => setCategories((prev) => prev.map((x) => x.id === ch.id ? { ...x, sortOrder: Number(e.target.value || 0) } : x))}
                                        style={{ padding: "8px 10px", borderRadius: 12, width: 90, textAlign: "right" }}
                                      />
                                      <button type="button" className="admin-btn" onClick={() => saveChildCategory(ch.id)} disabled={uploading}>Kaydet</button>
                                      <button type="button" className="admin-btn" onClick={() => deleteChildCategory(ch.id)} disabled={uploading}>Sil</button>
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <div className="admin-muted" style={{ fontSize: 12 }}>Henüz alt kategori yok.</div>
                            ))}

                            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
                              <input
                                className="admin-input"
                                value={newChildByParent[c.id] || ""}
                                onChange={(e) => setNewChildByParent((prev) => ({ ...prev, [c.id]: e.target.value }))}
                                placeholder="Yeni ölçü / alt kategori (örn: 80x80)"
                                style={{ padding: "8px 10px", borderRadius: 12, minWidth: 240 }}
                              />
                              <button
                                type="button"
                                className="admin-btn"
                                onClick={async () => {
                                  const val = String(newChildByParent[c.id] || "").trim()
                                  if (!val) return
                                  await createChildCategory(c.id, val)
                                  setNewChildByParent((prev) => ({ ...prev, [c.id]: "" }))
                                }}
                                disabled={uploading || !String(newChildByParent[c.id] || "").trim()}
                              >
                                Ekle
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </td>

                      <td>
                        <input
                          className="admin-input"
                          value={c.slug || ""}
                          onChange={(e) => setCategories((prev) => prev.map((x) => x.id === c.id ? { ...x, slug: slugify(e.target.value) } : x))}
                          style={{ padding: "8px 10px", borderRadius: 12, minWidth: 180 }}
                        />
                      </td>

                      <td>
                        <select
                          className="admin-input"
                          value={c.parentId ? String(c.parentId) : ""}
                          onChange={(e) => setCategories((prev) => prev.map((x) => x.id === c.id ? { ...x, parentId: e.target.value ? Number(e.target.value) : null } : x))}
                          style={{ padding: "8px 10px", borderRadius: 12, minWidth: 140 }}
                        >
                          <option value="">-</option>
                          {categories.filter((x) => x.id !== c.id).map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        {c.parentId ? (
                          <div className="admin-muted" style={{ fontSize: 12, marginTop: 6 }}>{getParentName(c.parentId) || ""}</div>
                        ) : null}
                      </td>

                      <td style={{ minWidth: 240 }}>
                        <input
                          className="admin-input"
                          value={c.iconImage || ""}
                          onChange={(e) => setCategories((prev) => prev.map((x) => x.id === c.id ? { ...x, iconImage: e.target.value } : x))}
                          style={{ padding: "8px 10px", borderRadius: 12, marginBottom: 8 }}
                        />
                        <input className="admin-input" type="file" accept="image/*" onChange={onPickRowIcon(c.id)} disabled={uploading} style={{ padding: "8px 10px", borderRadius: 12 }} />
                      </td>

                      <td className="is-right" style={{ width: 110 }}>
                        <input
                          className="admin-input"
                          type="number"
                          value={Number(c.sortOrder || 0)}
                          onChange={(e) => setCategories((prev) => prev.map((x) => x.id === c.id ? { ...x, sortOrder: Number(e.target.value || 0) } : x))}
                          style={{ padding: "8px 10px", borderRadius: 12, width: 90, textAlign: "right" }}
                        />
                      </td>

                      <td className="is-right" style={{ width: 200 }}>
                        <div className="admin-inline-actions">
                          <button type="button" className="admin-btn" onClick={onRowSave(c.id)} disabled={uploading}>Kaydet</button>
                          <button type="button" className="admin-btn" onClick={onRowDelete(c.id)} disabled={uploading}>Sil</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="is-muted" style={{ padding: 18 }}>Henüz kategori yok.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .admin-categories-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
