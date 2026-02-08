'use client'

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"

const emptyItem = () => ({
  label: "",
  href: "",
  targetBlank: false,
  isLabel: false,
  isActive: true,
  sortOrder: 0,
})

export default function AdminMenuEditPage() {
  const params = useParams()
  const router = useRouter()
  const key = params?.key

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const [menuName, setMenuName] = useState("")
  const [items, setItems] = useState([])

  const canSave = useMemo(() => items.every((i) => (i.isLabel ? Boolean(i.label.trim()) : Boolean(i.label.trim()) && Boolean(i.href.trim()))), [items])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const res = await fetch(`/api/admin/menus/${encodeURIComponent(String(key))}`)
        if (res.status === 401) {
          router.push(`/admin/login?next=${encodeURIComponent(`/admin/menus/${String(key)}`)}`)
          return
        }
        const json = await res.json().catch(() => null)
        if (!res.ok || !json?.ok || !json?.menu) throw new Error("load_failed")

        if (cancelled) return
        setMenuName(json.menu.name || "")
        setItems(
          (json.menu.items || []).map((i) => ({
            label: i.label || "",
            href: i.href || "",
            targetBlank: Boolean(i.targetBlank),
            isLabel: Boolean(i.isLabel),
            isActive: i.isActive === false ? false : true,
            sortOrder: Number(i.sortOrder || 0),
          }))
        )
      } catch {
        if (!cancelled) setError("Menü yüklenemedi.")
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
    setItems((prev) => {
      const next = [...prev]
      next.push({ ...emptyItem(), sortOrder: next.length ? (Number(next[next.length - 1].sortOrder) || 0) + 10 : 10 })
      return next
    })
  }

  const removeRow = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx))

  const updateRow = (idx, patch) => {
    setItems((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)))
  }

  const onSave = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!canSave) {
      setError("Label/href alanlarını kontrol et.")
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/admin/menus/${encodeURIComponent(String(key))}`,
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({
              label: i.label,
              href: i.href,
              targetBlank: Boolean(i.targetBlank),
              isLabel: Boolean(i.isLabel),
              isActive: i.isActive === false ? false : true,
              sortOrder: Number(i.sortOrder || 0),
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
          <h1 className="admin-toolbar__title">Menü Düzenle</h1>
          <div className="admin-muted" style={{ fontSize: 13, marginTop: 4 }}>
            {String(key)} {menuName ? `• ${menuName}` : ""}
          </div>
        </div>
        <div className="admin-toolbar__actions">
          <Link href="/admin/menus" className="admin-btn">Geri</Link>
          <button className="admin-btn" onClick={onSave} disabled={saving}>Kaydet</button>
        </div>
      </div>

      {error ? <div className="admin-alert" style={{ marginTop: 12 }}>{error}</div> : null}
      {message ? <div className="admin-success" style={{ marginTop: 12 }}>{message}</div> : null}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
        <div className="admin-muted" style={{ fontSize: 13 }}>Satır ekleyip sıralama için sortOrder kullan.</div>
        <button type="button" className="admin-btn" onClick={addRow}>Satır Ekle</button>
      </div>

      <div className="admin-table-wrap" style={{ marginTop: 12 }}>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 110 }}>Sıra</th>
                <th>Label</th>
                <th>Href</th>
                <th className="is-right" style={{ width: 110 }}>Label?</th>
                <th className="is-right" style={{ width: 140 }}>Yeni Sekme</th>
                <th className="is-right" style={{ width: 110 }}>Aktif</th>
                <th className="is-right" style={{ width: 110 }}>Sil</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r, idx) => (
                <tr key={idx}>
                  <td>
                    <input className="admin-input" value={r.sortOrder} onChange={(e) => updateRow(idx, { sortOrder: Number(e.target.value || 0) })} style={{ padding: "8px 10px", borderRadius: 12, width: 90, textAlign: "right" }} />
                  </td>
                  <td>
                    <input className="admin-input" value={r.label} onChange={(e) => updateRow(idx, { label: e.target.value })} style={{ padding: "8px 10px", borderRadius: 12, minWidth: 180 }} />
                  </td>
                  <td>
                    <input className="admin-input" value={r.href} onChange={(e) => updateRow(idx, { href: e.target.value })} disabled={r.isLabel} style={{ padding: "8px 10px", borderRadius: 12, minWidth: 200 }} />
                  </td>
                  <td className="is-right">
                    <input type="checkbox" className="admin-checkbox" checked={r.isLabel} onChange={(e) => updateRow(idx, { isLabel: e.target.checked, href: e.target.checked ? "#" : r.href })} />
                  </td>
                  <td className="is-right">
                    <input type="checkbox" className="admin-checkbox" checked={r.targetBlank} onChange={(e) => updateRow(idx, { targetBlank: e.target.checked })} disabled={r.isLabel} />
                  </td>
                  <td className="is-right">
                    <input type="checkbox" className="admin-checkbox" checked={r.isActive} onChange={(e) => updateRow(idx, { isActive: e.target.checked })} />
                  </td>
                  <td className="is-right">
                    <button type="button" className="admin-btn admin-btn--danger" onClick={() => removeRow(idx)}>Sil</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="is-muted" style={{ padding: 18 }}>Henüz öğe yok.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
