'use client'

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"

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

export default function AdminBlogPostEditPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id

  const [categories, setCategories] = useState([])

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [contentHtml, setContentHtml] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [published, setPublished] = useState(false)
  const [tagText, setTagText] = useState("")

  const [seoTitle, setSeoTitle] = useState("")
  const [seoDescription, setSeoDescription] = useState("")
  const [canonicalUrl, setCanonicalUrl] = useState("")
  const [ogImage, setOgImage] = useState("")

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const autoSlug = useMemo(() => slugify(title), [title])

  const loadCategories = async () => {
    const res = await fetch("/api/admin/blog/categories")
    const json = await res.json().catch(() => null)
    if (!res.ok || !json?.ok) throw new Error("load_failed")
    setCategories(json.categories || [])
  }

  const loadPost = async () => {
    const res = await fetch(`/api/admin/blog/posts/${encodeURIComponent(String(id))}`)
    const json = await res.json().catch(() => null)
    if (!res.ok || !json?.ok) throw new Error("load_failed")
    const p = json.post

    setTitle(p?.title || "")
    setSlug(p?.slug || "")
    setExcerpt(p?.excerpt || "")
    setContentHtml(p?.contentHtml || "")
    setCoverImage(p?.coverImage || "")
    setAuthorName(p?.authorName || "")
    setCategoryId(p?.categoryId ? String(p.categoryId) : "")
    setPublished(Boolean(p?.published))
    setTagText(Array.isArray(p?.tags) ? p.tags.map((x) => x?.tag?.name).filter(Boolean).join(", ") : "")

    setSeoTitle(p?.seoTitle || "")
    setSeoDescription(p?.seoDescription || "")
    setCanonicalUrl(p?.canonicalUrl || "")
    setOgImage(p?.ogImage || "")
  }

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([loadCategories(), loadPost()])
      .catch(() => setError("Yazı yüklenemedi."))
      .finally(() => setLoading(false))
  }, [id])

  const uploadFile = async (file) => {
    const form = new FormData()
    form.append("file", file)
    const res = await fetch("/api/admin/upload", { method: "POST", body: form })
    if (!res.ok) throw new Error("upload_failed")
    const json = await res.json().catch(() => null)
    if (!json?.ok || !json?.url) throw new Error("upload_failed")
    return json.url
  }

  const onPickCover = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError("")
    setUploading(true)
    try {
      const url = await uploadFile(file)
      setCoverImage(url)
      if (!ogImage) setOgImage(url)
    } catch {
      setError("Kapak görseli yüklenemedi.")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const onSave = async (e) => {
    e.preventDefault()
    setError("")

    const finalTitle = title.trim()
    const finalSlug = (slug || autoSlug).trim()
    if (!finalTitle) return setError("Başlık zorunlu.")
    if (!finalSlug) return setError("Slug zorunlu.")

    setSaving(true)
    try {
      const res = await fetch(`/api/admin/blog/posts/${encodeURIComponent(String(id))}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: finalTitle,
          slug: finalSlug,
          excerpt: excerpt || null,
          contentHtml: contentHtml || null,
          coverImage: coverImage || null,
          authorName: authorName || null,
          categoryId: categoryId ? Number(categoryId) : null,
          published,
          tags: tagText
            .split(/[,\n]/g)
            .map((t) => String(t || "").trim())
            .filter(Boolean),
          seoTitle: seoTitle || null,
          seoDescription: seoDescription || null,
          canonicalUrl: canonicalUrl || null,
          ogImage: ogImage || null,
        }),
      })

      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.ok) throw new Error(json?.error || "save_failed")

      await loadPost()
    } catch {
      setError("Kaydedilemedi.")
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    const ok = window.confirm("Yazıyı silmek istiyor musun?")
    if (!ok) return
    setError("")
    try {
      const res = await fetch(`/api/admin/blog/posts/${encodeURIComponent(String(id))}`, { method: "DELETE" })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.ok) throw new Error("delete_failed")
      router.push("/admin/blog")
    } catch {
      setError("Silinemedi.")
    }
  }

  if (loading) return <div className="admin-muted">Yükleniyor...</div>

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-toolbar__title">Blog Yazısı Düzenle</h1>
          <div className="admin-muted" style={{ fontSize: 13, marginTop: 4 }}>
            Değişiklikleri kaydet ve yayın durumunu yönet.
          </div>
        </div>
        <div className="admin-toolbar__actions">
          <a href={`/blog/${encodeURIComponent(slug || String(id))}`} className="admin-btn" target="_blank" rel="noreferrer">Görüntüle</a>
          <button className="admin-btn admin-btn--danger" type="button" onClick={onDelete}>Sil</button>
          <button className="admin-btn" type="submit" form="blogPostEditForm" disabled={saving || uploading}>
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>

      {error ? <div className="admin-alert" style={{ marginTop: 12 }}>{error}</div> : null}

      <form onSubmit={onSave} id="blogPostEditForm" style={{ marginTop: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 12 }}>
          <div style={{ gridColumn: "span 8" }}>
            <div className="admin-card" style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 800, marginBottom: 12 }}>İçerik</div>

              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">Başlık</label>
                <input className="admin-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">Slug</label>
                <input className="admin-input" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder={autoSlug} required />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">Özet</label>
                <textarea className="admin-input" rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
              </div>

              <div>
                <label className="admin-label">İçerik (HTML)</label>
                <textarea className="admin-input" rows={12} value={contentHtml} onChange={(e) => setContentHtml(e.target.value)} />
              </div>
            </div>

            <div className="admin-card">
              <div style={{ fontWeight: 800, marginBottom: 12 }}>SEO</div>

              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">SEO Başlık</label>
                <input className="admin-input" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">SEO Açıklama</label>
                <textarea className="admin-input" rows={3} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">Canonical URL</label>
                <input className="admin-input" value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} />
              </div>

              <div>
                <label className="admin-label">OG Image</label>
                <input className="admin-input" value={ogImage} onChange={(e) => setOgImage(e.target.value)} />
              </div>
            </div>
          </div>

          <div style={{ gridColumn: "span 4" }}>
            <div className="admin-card">
              <div style={{ fontWeight: 800, marginBottom: 12 }}>Yayın</div>

              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">Kategori</label>
                <select className="admin-input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  <option value="">Seç</option>
                  {categories.filter((c) => c.isActive !== false).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">Yazar</label>
                <input className="admin-input" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">Etiketler (SEO)</label>
                <input className="admin-input" value={tagText} onChange={(e) => setTagText(e.target.value)} placeholder="Örn: jakuzi, bakım, montaj" />
                <div className="admin-muted" style={{ fontSize: 12, marginTop: 6 }}>Virgül veya satır ile ayırabilirsin.</div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">Kapak Görseli</label>
                <input className="admin-input" type="file" accept="image/*" onChange={onPickCover} disabled={uploading} />
                <div style={{ marginTop: 8 }}>
                  <input className="admin-input" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="/uploads/..." />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <input className="admin-checkbox" type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} id="blogPublishedEdit" />
                <label htmlFor="blogPublishedEdit" className="admin-muted" style={{ fontSize: 13 }}>Yayında</label>
              </div>

              <button className="admin-primary" type="submit" disabled={saving || uploading}>
                {saving ? "Kaydediliyor..." : uploading ? "Yükleniyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
