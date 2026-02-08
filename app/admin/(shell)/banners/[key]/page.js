'use client'

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"

const emptyBanner = () => ({
  imageUrl: "",
  alt: "",
  title: "",
  subtitle: "",
  href: "",
  variant: "",
  isActive: true,
  sortOrder: 0,
})

export default function AdminBannerGroupEditPage() {
  const params = useParams()
  const router = useRouter()
  const key = params?.key

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const [groupName, setGroupName] = useState("")
  const [banners, setBanners] = useState([])

  const canSave = useMemo(() => banners.every((b) => Boolean(b.imageUrl.trim())), [banners])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const res = await fetch(`/api/admin/banners/${encodeURIComponent(String(key))}`)
        if (res.status === 401) {
          router.push(`/admin/login?next=${encodeURIComponent(`/admin/banners/${String(key)}`)}`)
          return
        }
        const json = await res.json().catch(() => null)
        if (!res.ok || !json?.ok || !json?.group) throw new Error("load_failed")

        if (cancelled) return
        setGroupName(json.group.name || "")
        setBanners(
          (json.group.banners || []).map((b) => ({
            imageUrl: b.imageUrl || "",
            alt: b.alt || "",
            title: b.title || "",
            subtitle: b.subtitle || "",
            href: b.href || "",
            variant: b.variant || "",
            isActive: b.isActive === false ? false : true,
            sortOrder: Number(b.sortOrder || 0),
          }))
        )
      } catch {
        if (!cancelled) setError("Banner grubu yüklenemedi.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (key) load()

    return () => {
      cancelled = true
    }
  }, [key, router])

  const addRow = () => {
    setBanners((prev) => {
      const next = [...prev]
      next.push({ ...emptyBanner(), sortOrder: next.length ? (Number(next[next.length - 1].sortOrder) || 0) + 10 : 10 })
      return next
    })
  }

  const removeRow = (idx) => setBanners((prev) => prev.filter((_, i) => i !== idx))

  const updateRow = (idx, patch) => {
    setBanners((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)))
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

  const onPickImage = (idx) => async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError("")
    try {
      const url = await uploadFile(file)
      updateRow(idx, { imageUrl: url })
    } catch {
      setError("Görsel yükleme başarısız.")
    }
  }

  const onSave = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!canSave) {
      setError("imageUrl zorunlu.")
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/admin/banners/${encodeURIComponent(String(key))}`,
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            banners: banners.map((b) => ({
              imageUrl: b.imageUrl,
              alt: b.alt || null,
              title: b.title || null,
              subtitle: b.subtitle || null,
              href: b.href || null,
              variant: b.variant || null,
              isActive: b.isActive === false ? false : true,
              sortOrder: Number(b.sortOrder || 0),
            })),
          }),
        }
      )

      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.ok) throw new Error("save_failed")
      setMessage("Kaydedildi.")
    } catch {
      setError("Kaydedilemedi.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-muted">Yükleniyor...</div>

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-toolbar__title">Banner Düzenle</h1>
          <div className="admin-muted" style={{ fontSize: 13, marginTop: 4 }}>
            {String(key)} {groupName ? `• ${groupName}` : ""}
          </div>
        </div>
        <div className="admin-toolbar__actions">
          <Link href="/admin/banners" className="admin-btn">Geri</Link>
          <button className="admin-btn" onClick={onSave} disabled={saving}>Kaydet</button>
        </div>
      </div>

      {error ? <div className="admin-alert" style={{ marginTop: 12 }}>{error}</div> : null}
      {message ? <div className="admin-success" style={{ marginTop: 12 }}>{message}</div> : null}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
        <div className="admin-muted" style={{ fontSize: 13 }}>Banner satırlarını sırala ve aktif/pasif yap.</div>
        <button type="button" className="admin-btn" onClick={addRow}>Banner Ekle</button>
      </div>

      <div className="admin-table-wrap" style={{ marginTop: 12 }}>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 110 }}>Sıra</th>
                <th>Görsel</th>
                <th>Alt</th>
                <th>Başlık</th>
                <th>Alt Başlık</th>
                <th>Link</th>
                <th>Variant</th>
                <th className="is-right" style={{ width: 110 }}>Aktif</th>
                <th className="is-right" style={{ width: 110 }}>Sil</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((b, idx) => (
                <tr key={idx}>
                  <td>
                    <input className="admin-input" value={b.sortOrder} onChange={(e) => updateRow(idx, { sortOrder: Number(e.target.value || 0) })} style={{ padding: "8px 10px", borderRadius: 12, width: 90, textAlign: "right" }} />
                  </td>
                  <td style={{ minWidth: 260 }}>
                    <input className="admin-input" value={b.imageUrl} onChange={(e) => updateRow(idx, { imageUrl: e.target.value })} style={{ padding: "8px 10px", borderRadius: 12, marginBottom: 8 }} />
                    <input className="admin-input" type="file" accept="image/*" onChange={onPickImage(idx)} style={{ padding: "8px 10px", borderRadius: 12 }} />
                  </td>
                  <td>
                    <input className="admin-input" value={b.alt} onChange={(e) => updateRow(idx, { alt: e.target.value })} style={{ padding: "8px 10px", borderRadius: 12, minWidth: 160 }} />
                  </td>
                  <td>
                    <input className="admin-input" value={b.title} onChange={(e) => updateRow(idx, { title: e.target.value })} style={{ padding: "8px 10px", borderRadius: 12, minWidth: 160 }} />
                  </td>
                  <td>
                    <input className="admin-input" value={b.subtitle} onChange={(e) => updateRow(idx, { subtitle: e.target.value })} style={{ padding: "8px 10px", borderRadius: 12, minWidth: 160 }} />
                  </td>
                  <td>
                    <input className="admin-input" value={b.href} onChange={(e) => updateRow(idx, { href: e.target.value })} style={{ padding: "8px 10px", borderRadius: 12, minWidth: 180 }} />
                  </td>
                  <td>
                    <input className="admin-input" value={b.variant} onChange={(e) => updateRow(idx, { variant: e.target.value })} style={{ padding: "8px 10px", borderRadius: 12, minWidth: 140 }} />
                  </td>
                  <td className="is-right">
                    <input type="checkbox" className="admin-checkbox" checked={b.isActive} onChange={(e) => updateRow(idx, { isActive: e.target.checked })} />
                  </td>
                  <td className="is-right">
                    <button type="button" className="admin-btn admin-btn--danger" onClick={() => removeRow(idx)}>Sil</button>
                  </td>
                </tr>
              ))}
              {banners.length === 0 ? (
                <tr>
                  <td colSpan={9} className="is-muted" style={{ padding: 18 }}>Henüz banner yok.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
