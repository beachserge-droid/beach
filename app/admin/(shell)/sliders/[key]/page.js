'use client'

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"

const emptySlide = () => ({
  title: "",
  subtitle: "",
  buttonLabel: "",
  buttonHref: "",
  imageUrl: "",
  isActive: true,
  sortOrder: 0,
})

export default function AdminSliderEditPage() {
  const params = useParams()
  const router = useRouter()
  const key = params?.key

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const [sliderName, setSliderName] = useState("")
  const [slides, setSlides] = useState([])

  const canSave = useMemo(() => slides.every((s) => Boolean(s.title.trim()) && Boolean(s.imageUrl.trim())), [slides])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const res = await fetch(`/api/admin/sliders/${encodeURIComponent(String(key))}`)
        if (res.status === 401) {
          router.push(`/admin/login?next=${encodeURIComponent(`/admin/sliders/${String(key)}`)}`)
          return
        }
        const json = await res.json().catch(() => null)
        if (!res.ok || !json?.ok || !json?.slider) throw new Error("load_failed")

        if (cancelled) return
        setSliderName(json.slider.name || "")
        setSlides(
          (json.slider.slides || []).map((s) => ({
            title: s.title || "",
            subtitle: s.subtitle || "",
            buttonLabel: s.buttonLabel || "",
            buttonHref: s.buttonHref || "",
            imageUrl: s.imageUrl || "",
            isActive: s.isActive === false ? false : true,
            sortOrder: Number(s.sortOrder || 0),
          }))
        )
      } catch {
        if (!cancelled) setError("Slider yüklenemedi.")
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
    setSlides((prev) => {
      const next = [...prev]
      next.push({ ...emptySlide(), sortOrder: next.length ? (Number(next[next.length - 1].sortOrder) || 0) + 10 : 10 })
      return next
    })
  }

  const removeRow = (idx) => setSlides((prev) => prev.filter((_, i) => i !== idx))

  const updateRow = (idx, patch) => {
    setSlides((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)))
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
      setError("Title ve imageUrl zorunlu.")
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/admin/sliders/${encodeURIComponent(String(key))}`,
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            slides: slides.map((s) => ({
              title: s.title,
              subtitle: s.subtitle || null,
              buttonLabel: s.buttonLabel || null,
              buttonHref: s.buttonHref || null,
              imageUrl: s.imageUrl,
              isActive: s.isActive === false ? false : true,
              sortOrder: Number(s.sortOrder || 0),
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
          <h1 className="admin-toolbar__title">Slider Düzenle</h1>
          <div className="admin-muted" style={{ fontSize: 13, marginTop: 4 }}>
            {String(key)} {sliderName ? `• ${sliderName}` : ""}
          </div>
        </div>
        <div className="admin-toolbar__actions">
          <Link href="/admin/sliders" className="admin-btn">Geri</Link>
          <button className="admin-btn" onClick={onSave} disabled={saving}>Kaydet</button>
        </div>
      </div>

      {error ? <div className="admin-alert" style={{ marginTop: 12 }}>{error}</div> : null}
      {message ? <div className="admin-success" style={{ marginTop: 12 }}>{message}</div> : null}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
        <div className="admin-muted" style={{ fontSize: 13 }}>Slider slide’larını sırala ve aktif/pasif yap.</div>
        <button type="button" className="admin-btn" onClick={addRow}>Slide Ekle</button>
      </div>

      <div className="admin-table-wrap" style={{ marginTop: 12 }}>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 110 }}>Sıra</th>
                <th>Başlık</th>
                <th>Alt Başlık</th>
                <th>Buton</th>
                <th>Link</th>
                <th>Görsel</th>
                <th className="is-right" style={{ width: 110 }}>Aktif</th>
                <th className="is-right" style={{ width: 110 }}>Sil</th>
              </tr>
            </thead>
            <tbody>
              {slides.map((s, idx) => (
                <tr key={idx}>
                  <td>
                    <input className="admin-input" value={s.sortOrder} onChange={(e) => updateRow(idx, { sortOrder: Number(e.target.value || 0) })} style={{ padding: "8px 10px", borderRadius: 12, width: 90, textAlign: "right" }} />
                  </td>
                  <td>
                    <input className="admin-input" value={s.title} onChange={(e) => updateRow(idx, { title: e.target.value })} style={{ padding: "8px 10px", borderRadius: 12, minWidth: 180 }} />
                  </td>
                  <td>
                    <input className="admin-input" value={s.subtitle} onChange={(e) => updateRow(idx, { subtitle: e.target.value })} style={{ padding: "8px 10px", borderRadius: 12, minWidth: 180 }} />
                  </td>
                  <td>
                    <input className="admin-input" value={s.buttonLabel} onChange={(e) => updateRow(idx, { buttonLabel: e.target.value })} style={{ padding: "8px 10px", borderRadius: 12, minWidth: 140 }} />
                  </td>
                  <td>
                    <input className="admin-input" value={s.buttonHref} onChange={(e) => updateRow(idx, { buttonHref: e.target.value })} style={{ padding: "8px 10px", borderRadius: 12, minWidth: 180 }} />
                  </td>
                  <td style={{ minWidth: 260 }}>
                    <input className="admin-input" value={s.imageUrl} onChange={(e) => updateRow(idx, { imageUrl: e.target.value })} style={{ padding: "8px 10px", borderRadius: 12, marginBottom: 8 }} />
                    <input className="admin-input" type="file" accept="image/*" onChange={onPickImage(idx)} style={{ padding: "8px 10px", borderRadius: 12 }} />
                  </td>
                  <td className="is-right">
                    <input type="checkbox" className="admin-checkbox" checked={s.isActive} onChange={(e) => updateRow(idx, { isActive: e.target.checked })} />
                  </td>
                  <td className="is-right">
                    <button type="button" className="admin-btn admin-btn--danger" onClick={() => removeRow(idx)}>Sil</button>
                  </td>
                </tr>
              ))}
              {slides.length === 0 ? (
                <tr>
                  <td colSpan={8} className="is-muted" style={{ padding: 18 }}>Henüz slide yok.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
