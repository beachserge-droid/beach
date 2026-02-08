'use client'

import { useEffect, useMemo, useState } from "react"

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const [siteName, setSiteName] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [headerPhone, setHeaderPhone] = useState("")
  const [headerEmail, setHeaderEmail] = useState("")

  const [footerAbout, setFooterAbout] = useState("")
  const [footerPhone, setFooterPhone] = useState("")
  const [footerWorkHours, setFooterWorkHours] = useState("")

  const [socialFacebook, setSocialFacebook] = useState("")
  const [socialInstagram, setSocialInstagram] = useState("")
  const [socialYoutube, setSocialYoutube] = useState("")
  const [socialX, setSocialX] = useState("")

  // SEO State
  const [defaultSeoTitle, setDefaultSeoTitle] = useState("")
  const [defaultSeoDescription, setDefaultSeoDescription] = useState("")
  const [defaultSeoKeywords, setDefaultSeoKeywords] = useState("")
  const [siteUrl, setSiteUrl] = useState("")
  const [googleVerification, setGoogleVerification] = useState("")
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState("")

  const hasLogo = useMemo(() => Boolean(logoUrl), [logoUrl])

  const load = async () => {
    const res = await fetch("/api/admin/settings")
    const json = await res.json().catch(() => null)
    if (!res.ok || !json?.ok) throw new Error("load_failed")

    const s = json.settings || {}
    setSiteName(s.siteName || "")
    setLogoUrl(s.logoUrl || "")
    setHeaderPhone(s.headerPhone || "")
    setHeaderEmail(s.headerEmail || "")

    setFooterAbout(s.footerAbout || "")
    setFooterPhone(s.footerPhone || "")
    setFooterWorkHours(s.footerWorkHours || "")

    setSocialFacebook(s.socialFacebook || "")
    setSocialInstagram(s.socialInstagram || "")
    setSocialYoutube(s.socialYoutube || "")
    setSocialX(s.socialX || "")

    // Load SEO settings
    setDefaultSeoTitle(s.defaultSeoTitle || "")
    setDefaultSeoDescription(s.defaultSeoDescription || "")
    setDefaultSeoKeywords(s.defaultSeoKeywords || "")
    setSiteUrl(s.siteUrl || "")
    setGoogleVerification(s.googleVerification || "")
    setGoogleAnalyticsId(s.googleAnalyticsId || "")
  }

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        await load()
      } catch {
        if (!cancelled) setError("Ayarlar yüklenemedi.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => { cancelled = true }
  }, [])

  const uploadFile = async (file) => {
    const form = new FormData()
    form.append("file", file)

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: form,
    })

    if (!res.ok) throw new Error("upload_failed")
    const json = await res.json()
    if (!json?.ok || !json?.url) throw new Error("upload_failed")
    return json.url
  }

  const onPickLogo = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError("")
    setMessage("")

    try {
      const url = await uploadFile(file)
      setLogoUrl(url)
    } catch {
      setError("Logo yükleme başarısız.")
    } finally {
      setUploading(false)
    }
  }

  const onSave = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setSaving(true)

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          siteName: siteName.trim() || "Catalog",
          logoUrl: logoUrl || null,
          headerPhone: headerPhone || null,
          headerEmail: headerEmail || null,
          footerAbout: footerAbout || null,
          footerPhone: footerPhone || null,
          footerWorkHours: footerWorkHours || null,
          socialFacebook: socialFacebook || null,
          socialInstagram: socialInstagram || null,
          socialYoutube: socialYoutube || null,
          socialX: socialX || null,
          // SEO Fields
          defaultSeoTitle: defaultSeoTitle?.trim() || null,
          defaultSeoDescription: defaultSeoDescription?.trim() || null,
          defaultSeoKeywords: defaultSeoKeywords?.trim() || null,
          siteUrl: siteUrl?.trim() || null,
          googleVerification: googleVerification?.trim() || null,
          googleAnalyticsId: googleAnalyticsId?.trim() || null,
        }),
      })

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
          <h1 className="admin-toolbar__title">Site Ayarları</h1>
          <div className="admin-muted" style={{ fontSize: 13, marginTop: 4 }}>
            Genel bilgiler, footer, sosyal medya ve SEO varsayılanlarını yönet.
          </div>
        </div>
        <div className="admin-toolbar__actions">
          <button className="admin-btn" type="submit" form="adminSettingsForm" disabled={saving || uploading}>
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>

      {error ? <div className="admin-alert" style={{ marginTop: 12 }}>{error}</div> : null}
      {message ? <div className="admin-success" style={{ marginTop: 12 }}>{message}</div> : null}

      <form id="adminSettingsForm" onSubmit={onSave} style={{ marginTop: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 12 }}>
          <div style={{ gridColumn: "span 7" }}>
            <div className="admin-card" style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 800, marginBottom: 12 }}>Genel</div>
              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">Site Adı</label>
                <input className="admin-input" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">Header Telefon</label>
                <input className="admin-input" value={headerPhone} onChange={(e) => setHeaderPhone(e.target.value)} placeholder="+90 ..." />
              </div>

              <div>
                <label className="admin-label">Header E-posta</label>
                <input className="admin-input" value={headerEmail} onChange={(e) => setHeaderEmail(e.target.value)} placeholder="info@..." />
              </div>
            </div>

            <div className="admin-card" style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 800, marginBottom: 12 }}>Footer</div>

              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">Hakkımızda Metni</label>
                <textarea className="admin-input" rows={4} value={footerAbout} onChange={(e) => setFooterAbout(e.target.value)} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 10 }}>
                <div style={{ gridColumn: "span 6" }}>
                  <label className="admin-label">Footer Telefon</label>
                  <input className="admin-input" value={footerPhone} onChange={(e) => setFooterPhone(e.target.value)} />
                </div>
                <div style={{ gridColumn: "span 6" }}>
                  <label className="admin-label">Çalışma Saatleri</label>
                  <input className="admin-input" value={footerWorkHours} onChange={(e) => setFooterWorkHours(e.target.value)} placeholder="8:00 - 22:00" />
                </div>
              </div>
            </div>

            <div className="admin-card" style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 800, marginBottom: 12 }}>Sosyal</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 10 }}>
                <div style={{ gridColumn: "span 6" }}>
                  <label className="admin-label">Facebook</label>
                  <input className="admin-input" value={socialFacebook} onChange={(e) => setSocialFacebook(e.target.value)} placeholder="https://facebook.com/..." />
                </div>
                <div style={{ gridColumn: "span 6" }}>
                  <label className="admin-label">Instagram</label>
                  <input className="admin-input" value={socialInstagram} onChange={(e) => setSocialInstagram(e.target.value)} placeholder="https://instagram.com/..." />
                </div>
                <div style={{ gridColumn: "span 6" }}>
                  <label className="admin-label">YouTube</label>
                  <input className="admin-input" value={socialYoutube} onChange={(e) => setSocialYoutube(e.target.value)} placeholder="https://youtube.com/..." />
                </div>
                <div style={{ gridColumn: "span 6" }}>
                  <label className="admin-label">X (Twitter)</label>
                  <input className="admin-input" value={socialX} onChange={(e) => setSocialX(e.target.value)} placeholder="https://x.com/..." />
                </div>
              </div>
            </div>

            <div className="admin-card">
              <div style={{ fontWeight: 800, marginBottom: 12 }}>SEO</div>

              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">Varsayılan SEO Başlık</label>
                <input className="admin-input" value={defaultSeoTitle} onChange={(e) => setDefaultSeoTitle(e.target.value)} placeholder="Ninico - Premium Jakuzi ve Spa Ürünleri" />
                <div className="admin-muted" style={{ fontSize: 12, marginTop: 6 }}>Boş sayfalarda kullanılacak varsayılan başlık.</div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">Varsayılan SEO Açıklama</label>
                <textarea className="admin-input" rows={3} value={defaultSeoDescription} onChange={(e) => setDefaultSeoDescription(e.target.value)} placeholder="Premium jakuzi, spa ve wellness ürünleri..." />
                <div className="admin-muted" style={{ fontSize: 12, marginTop: 6 }}>Boş sayfalarda kullanılacak varsayılan açıklama. Max 160 karakter.</div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">Varsayılan Anahtar Kelimeler</label>
                <input className="admin-input" value={defaultSeoKeywords} onChange={(e) => setDefaultSeoKeywords(e.target.value)} placeholder="jakuzi, spa, wellness, premium" />
                <div className="admin-muted" style={{ fontSize: 12, marginTop: 6 }}>Virgülle ayırarak yazın.</div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">Site URL</label>
                <input className="admin-input" value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} placeholder="https://www.ninico.com.tr" />
                <div className="admin-muted" style={{ fontSize: 12, marginTop: 6 }}>Canonical URL'ler ve sitemap için kullanılır.</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 10 }}>
                <div style={{ gridColumn: "span 6" }}>
                  <label className="admin-label">Google Doğrulama Kodu</label>
                  <input className="admin-input" value={googleVerification} onChange={(e) => setGoogleVerification(e.target.value)} placeholder="google-site-verification=..." />
                </div>
                <div style={{ gridColumn: "span 6" }}>
                  <label className="admin-label">Google Analytics ID</label>
                  <input className="admin-input" value={googleAnalyticsId} onChange={(e) => setGoogleAnalyticsId(e.target.value)} placeholder="G-XXXXXXXXXX veya UA-..." />
                </div>
              </div>
            </div>
          </div>

          <div style={{ gridColumn: "span 5" }}>
            <div className="admin-card">
              <div style={{ fontWeight: 800, marginBottom: 12 }}>Logo</div>
              <input className="admin-input" type="file" accept="image/*" onChange={onPickLogo} disabled={uploading} />
              <div className="admin-muted" style={{ fontSize: 12, marginTop: 8 }}>
                Logo yüklendiğinde otomatik URL kaydedilir.
              </div>

              {hasLogo ? (
                <div style={{ marginTop: 14 }}>
                  <img src={logoUrl} alt="" style={{ maxWidth: 220, height: "auto" }} />
                  <div style={{ marginTop: 10 }}>
                    <input className="admin-input" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
                  </div>
                </div>
              ) : (
                <div className="admin-muted" style={{ marginTop: 14 }}>Henüz logo yok.</div>
              )}

              <button className="admin-primary" type="submit" disabled={saving || uploading} style={{ marginTop: 14 }}>
                {saving ? "Kaydediliyor..." : uploading ? "Yükleniyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 992px) {
            .admin-settings-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </form>
    </div>
  )
}
