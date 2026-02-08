'use client'

import { useEffect, useMemo, useRef, useState } from "react"
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

export default function AdminProductEditPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id

  const descriptionRef = useRef(null)

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [sku, setSku] = useState("")
  const [description, setDescription] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [published, setPublished] = useState(true)
  const [askCaptions, setAskCaptions] = useState(true)
  const [imageMain, setImageMain] = useState("")
  const [imageAlt, setImageAlt] = useState("")

  // SEO State
  const [seoTitle, setSeoTitle] = useState("")
  const [seoDescription, setSeoDescription] = useState("")
  const [seoKeywords, setSeoKeywords] = useState("")
  const [canonicalUrl, setCanonicalUrl] = useState("")
  const [ogImage, setOgImage] = useState("")
  const [noIndex, setNoIndex] = useState(false)

  const [activeTab, setActiveTab] = useState("general")

  const [parentCategoryId, setParentCategoryId] = useState("")
  const [childCategoryId, setChildCategoryId] = useState("")
  const [newChildName, setNewChildName] = useState("")

  const [colors, setColors] = useState([])
  const [colorIds, setColorIds] = useState([])

  const [tagText, setTagText] = useState("")
  const [specs, setSpecs] = useState([{ key: "", value: "", sortOrder: 10 }])
  const [images, setImages] = useState([])
  const [infoBoxes, setInfoBoxes] = useState([])
  const [features, setFeatures] = useState([])

  const [categories, setCategories] = useState([])

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const autoSlug = useMemo(() => slugify(title), [title])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`/api/admin/products/${encodeURIComponent(String(id))}`),
          fetch("/api/admin/categories"),
        ])

        const colorRes = await fetch("/api/admin/colors")

        if (prodRes.status === 401) {
          router.push(`/admin/login?next=${encodeURIComponent(`/admin/products/${String(id)}`)}`)
          return
        }

        if (prodRes.status === 404) {
          if (!cancelled) setError("Ürün bulunamadı.")
          return
        }

        if (!prodRes.ok) throw new Error("load_failed")
        const prodJson = await prodRes.json().catch(() => null)
        if (!prodJson?.ok || !prodJson?.product) throw new Error(prodJson?.error || "load_failed")

        const catJson = catRes.ok ? await catRes.json().catch(() => null) : null
        const catList = catJson?.ok && Array.isArray(catJson.categories) ? catJson.categories : []

        const colorJson = colorRes.ok ? await colorRes.json().catch(() => null) : null
        const colorList = colorJson?.ok && Array.isArray(colorJson.colors) ? colorJson.colors : []

        if (cancelled) return

        const p = prodJson.product
        setTitle(p.title || "")
        setSlug(p.slug || "")
        setSku(p.sku || "")
        setDescription(p.description || "")
        setVideoUrl(p.videoUrl || "")
        setPublished(Boolean(p.published))
        setImageMain(p.imageMain || "")
        setImageAlt(p.imageAlt || "")

        // Load SEO fields
        setSeoTitle(p.seoTitle || "")
        setSeoDescription(p.seoDescription || "")
        setSeoKeywords(p.seoKeywords || "")
        setCanonicalUrl(p.canonicalUrl || "")
        setOgImage(p.ogImage || "")
        setNoIndex(Boolean(p.noIndex))

        const selectedCatId = p.categoryId ? String(p.categoryId) : ""
        const selectedCat = selectedCatId ? catList.find((c) => String(c.id) === selectedCatId) : null
        const parentId = selectedCat?.parentId ? String(selectedCat.parentId) : selectedCatId
        const childId = selectedCat?.parentId ? selectedCatId : ""
        setParentCategoryId(parentId || "")
        setChildCategoryId(childId || "")

        const tagNames = Array.isArray(p.tags) ? p.tags.map((t) => t?.tag?.name).filter(Boolean) : []
        setTagText(tagNames.join(", "))

        const selectedColors = Array.isArray(p.colors) ? p.colors.map((c) => c?.color?.id).filter(Boolean) : []
        setColorIds(selectedColors)

        const nextSpecs = Array.isArray(p.specs) && p.specs.length
          ? p.specs.map((s) => ({ key: s.key || "", value: s.value || "", sortOrder: Number(s.sortOrder || 0) }))
          : [{ key: "", value: "", sortOrder: 10 }]
        setSpecs(nextSpecs)

        const nextImages = Array.isArray(p.images) ? p.images.map((im) => ({ url: im.url, alt: im.alt || "", sortOrder: Number(im.sortOrder || 0) })) : []
        setImages(nextImages)

        const nextFeatures = Array.isArray(p.features)
          ? p.features.map((f) => ({
            imageUrl: f.imageUrl || "",
            title: f.title || "",
            subtitle: f.subtitle || "",
            isActive: f.isActive === false ? false : true,
            sortOrder: Number(f.sortOrder || 0),
          }))
          : []
        setFeatures(nextFeatures)

        const nextInfo = Array.isArray(p.infoBoxes)
          ? p.infoBoxes.map((b) => ({
            iconUrl: b.iconUrl || "",
            title: b.title || "",
            subtitle: b.subtitle || "",
            color: b.color || "",
            isActive: b.isActive === false ? false : true,
            sortOrder: Number(b.sortOrder || 0),
          }))
          : []
        setInfoBoxes(nextInfo)

        setCategories(catList)
        setColors(colorList)
      } catch {
        if (!cancelled) setError("Ürün yüklenemedi. (Oturum veya API hatası)")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (id) load()

    return () => { cancelled = true }
  }, [id])

  const onAddGalleryImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError("")
    setUploading(true)
    try {
      const url = await uploadFile(file)
      setImages((prev) => ([
        ...prev,
        { url, alt: "", sortOrder: (prev.length + 1) * 10 },
      ]))
    } catch {
      setError("Görsel yükleme başarısız.")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const onCreateChildCategory = async () => {
    if (!parentCategoryId) return
    const finalName = String(newChildName || "").trim()
    if (!finalName) return

    setError("")
    setUploading(true)
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: finalName,
          slug: slugify(finalName),
          parentId: Number(parentCategoryId),
          sortOrder: 0,
          iconImage: null,
        }),
      })

      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.ok || !json?.category?.id) throw new Error("create_child_failed")

      const reload = await fetch("/api/admin/categories")
      if (reload.ok) {
        const j = await reload.json().catch(() => null)
        if (j?.ok && Array.isArray(j.categories)) setCategories(j.categories)
      }

      setChildCategoryId(String(json.category.id))
      setNewChildName("")
    } catch {
      setError("Alt kategori oluşturulamadı.")
    } finally {
      setUploading(false)
    }
  }

  const onPickVideoFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError("")
    try {
      const url = await uploadFile(file)
      setVideoUrl(url)
    } catch {
      setError("Video yükleme başarısız.")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

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

  const escapeHtml = (s) => String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;")

  const focusFirstFigcaption = (htmlToFind) => {
    if (!askCaptions) return
    const ta = descriptionRef.current
    if (!ta) return
    const full = String(ta.value || "")
    const idx = full.lastIndexOf(htmlToFind)
    if (idx < 0) return
    const open = full.indexOf("<figcaption>", idx)
    const close = full.indexOf("</figcaption>", idx)
    if (open < 0 || close < 0) return
    const start = open + "<figcaption>".length
    const end = close
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(start, end)
    })
  }

  const focusNextFigcaption = () => {
    const ta = descriptionRef.current
    if (!ta) return
    const full = String(ta.value || "")
    const from = Math.max(0, Number(ta.selectionEnd || 0))
    const open = full.indexOf("<figcaption>", from)
    const close = open >= 0 ? full.indexOf("</figcaption>", open) : -1
    if (open < 0 || close < 0) return
    const start = open + "<figcaption>".length
    const end = close
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(start, end)
    })
  }

  const onPickInfoIcon = (idx) => async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError("")
    try {
      const url = await uploadFile(file)
      setInfoBoxes((prev) => prev.map((b, i) => i === idx ? { ...b, iconUrl: url } : b))
    } catch {
      setError("Görsel yükleme başarısız.")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const onPickFeatureImage = (idx) => async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError("")
    try {
      const url = await uploadFile(file)
      setFeatures((prev) => prev.map((f, i) => i === idx ? { ...f, imageUrl: url } : f))
    } catch {
      setError("Görsel yükleme başarısız.")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const onAddDescriptionImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError("")
    try {
      const url = await uploadFile(file)
      const caption = ""
      const htmlToFind = `<figure class=\"tp-desc-media\">\n  <img src=\"${url}\" alt=\"\" />\n  <figcaption>${caption}</figcaption>\n</figure>\n`
      setDescription((prev) => {
        const current = String(prev || "")
        const sep = current && !current.endsWith("\n") ? "\n" : ""
        return `${current}${sep}${htmlToFind}`
      })
      focusFirstFigcaption(htmlToFind)
    } catch {
      setError("Görsel yükleme başarısız.")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const onAddDescriptionImages = async (e, count) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const picked = files.slice(0, count)
    if (picked.length !== count) {
      setError(`Lütfen ${count} görsel seç.`)
      e.target.value = ""
      return
    }

    setUploading(true)
    setError("")
    try {
      const items = []
      for (const f of picked) {
        const url = await uploadFile(f)
        const caption = ""
        items.push({ url, caption })
      }

      const gridClass = count === 2 ? "tp-desc-grid tp-desc-grid--2" : "tp-desc-grid tp-desc-grid--3"
      const html =
        `<div class=\"${gridClass}\">\n` +
        items
          .map((it) => `  <figure class=\"tp-desc-media\">\n    <img src=\"${it.url}\" alt=\"\" />\n    <figcaption>${it.caption}</figcaption>\n  </figure>`)
          .join("\n") +
        `\n</div>`

      setDescription((prev) => {
        const current = String(prev || "")
        const sep = current && !current.endsWith("\n") ? "\n" : ""
        return `${current}${sep}${html}\n`
      })

      focusFirstFigcaption(html)
    } catch {
      setError("Görsel(ler) yüklenemedi.")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const onPickImage = (setter) => async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError("")
    try {
      const url = await uploadFile(file)
      setter(url)
    } catch {
      setError("Görsel yükleme başarısız.")
    } finally {
      setUploading(false)
    }
  }

  const onSave = async (e) => {
    e.preventDefault()
    setError("")

    const finalSlug = (slug || autoSlug).trim()
    if (!title.trim()) return setError("Başlık zorunlu.")
    if (!finalSlug) return setError("Slug zorunlu.")

    setSaving(true)
    try {
      const categoryId = childCategoryId || parentCategoryId
      const tags = tagText
        .split(/[\n,]/g)
        .map((t) => String(t || "").trim())
        .filter(Boolean)

      const finalSpecs = specs
        .map((s, idx) => ({
          key: String(s.key || "").trim(),
          value: String(s.value || "").trim(),
          sortOrder: Number(s.sortOrder ?? (idx + 1) * 10),
        }))
        .filter((s) => s.key && s.value)

      const finalImages = images
        .map((im, idx) => ({
          url: String(im.url || "").trim(),
          alt: im.alt ? String(im.alt).trim() : null,
          sortOrder: Number(im.sortOrder ?? (idx + 1) * 10),
        }))
        .filter((im) => im.url)

      const finalFeatures = features
        .map((f, idx) => ({
          imageUrl: String(f.imageUrl || "").trim(),
          title: String(f.title || "").trim(),
          subtitle: f.subtitle ? String(f.subtitle) : null,
          isActive: f.isActive === false ? false : true,
          sortOrder: Number(f.sortOrder ?? (idx + 1) * 10),
        }))
        .filter((f) => f.title && f.imageUrl)

      const finalInfo = infoBoxes
        .map((b, idx) => ({
          iconUrl: String(b.iconUrl || "").trim(),
          title: String(b.title || "").trim(),
          subtitle: b.subtitle ? String(b.subtitle) : null,
          color: b.color ? String(b.color) : null,
          isActive: b.isActive === false ? false : true,
          sortOrder: Number(b.sortOrder ?? (idx + 1) * 10),
        }))
        .filter((b) => b.title)

      const res = await fetch(`/api/admin/products/${encodeURIComponent(String(id))}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: finalSlug,
          sku: sku.trim() || null,
          description: description.trim() || null,
          videoUrl: videoUrl.trim() || null,
          categoryId: categoryId ? Number(categoryId) : null,
          published,
          priceMin: "0.01",
          priceMax: "0.01",
          imageMain: imageMain || null,
          imageAlt: imageAlt || null,
          colorIds,
          tags,
          specs: finalSpecs,
          images: finalImages,
          features: finalFeatures,
          infoBoxes: finalInfo,
          // SEO Fields
          seoTitle: seoTitle.trim() || null,
          seoDescription: seoDescription.trim() || null,
          seoKeywords: seoKeywords.trim() || null,
          canonicalUrl: canonicalUrl.trim() || null,
          ogImage: ogImage || null,
          noIndex,
        }),
      })

      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.ok) {
        const msg = json?.error ? String(json.error) : "save_failed"
        throw new Error(msg)
      }

      router.push("/admin/products")
    } catch (err) {
      const msg = err && typeof err === "object" && "message" in err ? String(err.message) : "save_failed"
      setError(`Kaydedilemedi: ${msg}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="admin-muted">Yükleniyor...</div>
  }

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-toolbar__title">Ürün Düzenle</h1>
          <div className="admin-muted" style={{ fontSize: 13, marginTop: 4 }}>
            Ürün bilgilerini güncelle, SEO sekmesinden metadata’yı yönet.
          </div>
        </div>
        <div className="admin-toolbar__actions">
          <button className="admin-btn" type="submit" form="adminProductEditForm" disabled={saving || uploading}>
            {saving ? "Kaydediliyor..." : uploading ? "Yükleniyor..." : "Kaydet"}
          </button>
        </div>
      </div>

      {error ? <div className="admin-alert" style={{ marginTop: 12 }}>{error}</div> : null}

      {/* Tabs */}
      <ul className="nav nav-tabs mt-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
            type="button"
          >
            Genel
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "seo" ? "active" : ""}`}
            onClick={() => setActiveTab("seo")}
            type="button"
          >
            SEO
          </button>
        </li>
      </ul>

      <form id="adminProductEditForm" className="row g-3 mt-0" onSubmit={onSave}>
        {/* General Tab */}
        {activeTab === "general" && (
          <>
            <div className="col-12 col-lg-8">
              <div className="border rounded p-3">
                <div className="mb-3">
                  <label className="form-label">Başlık</label>
                  <input className="form-control" value={title} onChange={(e) => {
                    setTitle(e.target.value)
                    if (!slug) setSlug(slugify(e.target.value))
                  }} required />
                </div>

                <div className="mb-3">
                  <label className="form-label">Video URL (Ürüne Özel)</label>
                  <input className="form-control" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="YouTube / Vimeo linki veya mp4 URL" />
                  <div className="mt-2">
                    <input className="form-control" type="file" accept="video/*" onChange={onPickVideoFile} disabled={uploading} />
                    <div className="form-text">Video dosyası seçersen otomatik yükler ve URL alanına yazar.</div>
                  </div>
                  <div className="form-text">Ürün detayda video alanında gösterilir.</div>
                </div>

            <div className="mb-3">
              <label className="form-label">Ürün Bilgi Kutuları (Ürüne Özel)</label>
              <div className="table-responsive">
                <table className="table table-sm align-middle">
                  <thead>
                    <tr>
                      <th>İkon</th>
                      <th>Başlık</th>
                      <th>Alt</th>
                      <th>Renk</th>
                      <th className="text-end">Sıra</th>
                      <th className="text-center">Aktif</th>
                      <th className="text-end">Sil</th>
                    </tr>
                  </thead>
                  <tbody>
                    {infoBoxes.map((b, idx) => (
                      <tr key={idx}>
                        <td style={{ minWidth: 220 }}>
                          <input className="form-control form-control-sm mb-1" value={b.iconUrl} onChange={(e) => setInfoBoxes((prev) => prev.map((x, i) => i === idx ? { ...x, iconUrl: e.target.value } : x))} />
                          <input className="form-control form-control-sm" type="file" accept="image/*" onChange={onPickInfoIcon(idx)} disabled={uploading} />
                        </td>
                        <td>
                          <input className="form-control form-control-sm" value={b.title} onChange={(e) => setInfoBoxes((prev) => prev.map((x, i) => i === idx ? { ...x, title: e.target.value } : x))} placeholder="Örn: Ücretsiz Kargo" />
                        </td>
                        <td>
                          <input className="form-control form-control-sm" value={b.subtitle || ""} onChange={(e) => setInfoBoxes((prev) => prev.map((x, i) => i === idx ? { ...x, subtitle: e.target.value } : x))} placeholder="Örn: 1000₺ üzeri" />
                        </td>
                        <td style={{ width: 140 }}>
                          <input className="form-control form-control-sm" type="color" value={b.color || "#000000"} onChange={(e) => setInfoBoxes((prev) => prev.map((x, i) => i === idx ? { ...x, color: e.target.value } : x))} />
                        </td>
                        <td style={{ width: 90 }}>
                          <input className="form-control form-control-sm text-end" type="number" value={Number(b.sortOrder || 0)} onChange={(e) => setInfoBoxes((prev) => prev.map((x, i) => i === idx ? { ...x, sortOrder: Number(e.target.value || 0) } : x))} />
                        </td>
                        <td className="text-center" style={{ width: 80 }}>
                          <input type="checkbox" className="form-check-input" checked={b.isActive === false ? false : true} onChange={(e) => setInfoBoxes((prev) => prev.map((x, i) => i === idx ? { ...x, isActive: e.target.checked } : x))} />
                        </td>
                        <td className="text-end" style={{ width: 90 }}>
                          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setInfoBoxes((prev) => prev.filter((_, i) => i !== idx))}>Sil</button>
                        </td>
                      </tr>
                    ))}
                    {infoBoxes.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-muted py-3">Henüz kutu yok. "Kutu Ekle" ile oluştur.</td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setInfoBoxes((prev) => ([...prev, { iconUrl: "", title: "", subtitle: "", color: "", isActive: true, sortOrder: (prev.length + 1) * 10 }]))}>
                Kutu Ekle
              </button>
              <div className="form-text">Bu kutular sadece bu ürün için geçerlidir.</div>
            </div>

            <div className="mb-3">
              <label className="form-label">Etiketler</label>
              <input className="form-control" value={tagText} onChange={(e) => setTagText(e.target.value)} placeholder="Örn: spa, 80x80, siyah" />
              <div className="form-text">Virgülle veya satırla ayırabilirsin.</div>
            </div>

            <div className="mb-3">
              <label className="form-label">Özellikler / Spesifikasyon</label>
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-2">
                  <thead>
                    <tr>
                      <th>Anahtar</th>
                      <th>Değer</th>
                      <th className="text-end">Sıra</th>
                      <th className="text-end">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {specs.map((s, idx) => (
                      <tr key={idx}>
                        <td>
                          <input className="form-control form-control-sm" value={s.key} onChange={(e) => setSpecs((prev) => prev.map((x, i) => i === idx ? { ...x, key: e.target.value } : x))} placeholder="Örn: Ölçü" />
                        </td>
                        <td>
                          <input className="form-control form-control-sm" value={s.value} onChange={(e) => setSpecs((prev) => prev.map((x, i) => i === idx ? { ...x, value: e.target.value } : x))} placeholder="Örn: 80x80" />
                        </td>
                        <td style={{ width: 90 }}>
                          <input className="form-control form-control-sm text-end" type="number" value={Number(s.sortOrder || 0)} onChange={(e) => setSpecs((prev) => prev.map((x, i) => i === idx ? { ...x, sortOrder: Number(e.target.value || 0) } : x))} />
                        </td>
                        <td className="text-end" style={{ width: 110 }}>
                          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setSpecs((prev) => prev.filter((_, i) => i !== idx))} disabled={specs.length <= 1}>
                            Sil
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setSpecs((prev) => ([...prev, { key: "", value: "", sortOrder: (prev.length + 1) * 10 }]))}>
                Satır Ekle
              </button>
            </div>

            <div className="mb-3">
              <label className="form-label">Galeri Görselleri</label>
              <input className="form-control" type="file" accept="image/*" onChange={onAddGalleryImage} disabled={uploading} />
              {images.length ? (
                <div className="table-responsive mt-2">
                  <table className="table table-sm align-middle">
                    <thead>
                      <tr>
                        <th>URL</th>
                        <th>Alt</th>
                        <th className="text-end">Sıra</th>
                        <th className="text-end">İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {images.map((im, idx) => (
                        <tr key={`${im.url}-${idx}`}>
                          <td>
                            <input className="form-control form-control-sm" value={im.url} onChange={(e) => setImages((prev) => prev.map((x, i) => i === idx ? { ...x, url: e.target.value } : x))} />
                          </td>
                          <td>
                            <input className="form-control form-control-sm" value={im.alt || ""} onChange={(e) => setImages((prev) => prev.map((x, i) => i === idx ? { ...x, alt: e.target.value } : x))} />
                          </td>
                          <td style={{ width: 90 }}>
                            <input className="form-control form-control-sm text-end" type="number" value={Number(im.sortOrder || 0)} onChange={(e) => setImages((prev) => prev.map((x, i) => i === idx ? { ...x, sortOrder: Number(e.target.value || 0) } : x))} />
                          </td>
                          <td className="text-end" style={{ width: 110 }}>
                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}>Sil</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="form-text">İstersen ürün detayında galeri olarak gösterilir.</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Öne Çıkan Özellikler (Görselli)</label>
              <div className="table-responsive">
                <table className="table table-sm align-middle">
                  <thead>
                    <tr>
                      <th>Görsel</th>
                      <th>Başlık</th>
                      <th>Alt</th>
                      <th className="text-end">Sıra</th>
                      <th className="text-center">Aktif</th>
                      <th className="text-end">Sil</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((f, idx) => (
                      <tr key={idx}>
                        <td style={{ minWidth: 220 }}>
                          <input className="form-control form-control-sm mb-1" value={f.imageUrl || ""} onChange={(e) => setFeatures((prev) => prev.map((x, i) => i === idx ? { ...x, imageUrl: e.target.value } : x))} placeholder="https://..." />
                          <input className="form-control form-control-sm" type="file" accept="image/*" onChange={onPickFeatureImage(idx)} disabled={uploading} />
                        </td>
                        <td>
                          <input className="form-control form-control-sm" value={f.title || ""} onChange={(e) => setFeatures((prev) => prev.map((x, i) => i === idx ? { ...x, title: e.target.value } : x))} placeholder="Örn: 1.2 HP Turbo Motor" />
                        </td>
                        <td>
                          <input className="form-control form-control-sm" value={f.subtitle || ""} onChange={(e) => setFeatures((prev) => prev.map((x, i) => i === idx ? { ...x, subtitle: e.target.value } : x))} placeholder="Opsiyonel" />
                        </td>
                        <td style={{ width: 90 }}>
                          <input className="form-control form-control-sm text-end" type="number" value={Number(f.sortOrder || 0)} onChange={(e) => setFeatures((prev) => prev.map((x, i) => i === idx ? { ...x, sortOrder: Number(e.target.value || 0) } : x))} />
                        </td>
                        <td className="text-center" style={{ width: 80 }}>
                          <input type="checkbox" className="form-check-input" checked={f.isActive === false ? false : true} onChange={(e) => setFeatures((prev) => prev.map((x, i) => i === idx ? { ...x, isActive: e.target.checked } : x))} />
                        </td>
                        <td className="text-end" style={{ width: 90 }}>
                          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setFeatures((prev) => prev.filter((_, i) => i !== idx))}>Sil</button>
                        </td>
                      </tr>
                    ))}
                    {features.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-muted py-3">Henüz özellik yok. "Özellik Ekle" ile oluştur.</td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setFeatures((prev) => ([...prev, { imageUrl: "", title: "", subtitle: "", isActive: true, sortOrder: (prev.length + 1) * 10 }]))}>
                Özellik Ekle
              </button>
            </div>

            <div className="mb-3">
              <label className="form-label">SKU</label>
              <input className="form-control" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Örn: SPA-8080" />
            </div>

            <div className="mb-3">
              <label className="form-label">Slug</label>
              <input className="form-control" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder={autoSlug} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Açıklama</label>
              <div className="mb-2">
                <input className="form-control" type="file" accept="image/*" onChange={onAddDescriptionImage} disabled={uploading} />
                <div className="form-text">Görsel yükleyip açıklamaya &lt;img&gt; olarak ekler. (Frontend açıklamayı HTML olarak basar.)</div>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input" type="checkbox" checked={askCaptions} onChange={(e) => setAskCaptions(e.target.checked)} id="askCaptionsEdit" />
                <label className="form-check-label" htmlFor="askCaptionsEdit">Görsel ekledikten sonra caption alanına imleci getir</label>
              </div>
              <div className="d-flex gap-2 mb-2">
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={focusNextFigcaption} disabled={!askCaptions}>
                  Next caption
                </button>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-12 col-md-6">
                  <input className="form-control" type="file" accept="image/*" multiple onChange={(e) => onAddDescriptionImages(e, 2)} disabled={uploading} />
                  <div className="form-text">2 görsel seç → otomatik 2'li grid olarak ekler.</div>
                </div>
                <div className="col-12 col-md-6">
                  <input className="form-control" type="file" accept="image/*" multiple onChange={(e) => onAddDescriptionImages(e, 3)} disabled={uploading} />
                  <div className="form-text">3 görsel seç → otomatik 3'lü grid olarak ekler.</div>
                </div>
              </div>
              <textarea
                className="form-control"
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ürün açıklaması"
                ref={descriptionRef}
              />
            </div>

            <button className="btn btn-primary" type="submit" disabled={saving || uploading}>
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="border rounded p-3">
            <div className="mb-3">
              <label className="form-label">Renkler</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 8, marginTop: 8 }}>
                {colors.filter((c) => c.isActive !== false).map((c) => {
                  const isSelected = colorIds.includes(Number(c.id))
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setColorIds((prev) => isSelected
                          ? prev.filter((id) => id !== Number(c.id))
                          : [...prev, Number(c.id)]
                        )
                      }}
                      style={{
                        border: `1px solid ${isSelected ? "rgba(37, 99, 235, 0.45)" : "rgba(15, 17, 21, 0.12)"}`,
                        background: isSelected ? "rgba(37, 99, 235, 0.08)" : "rgba(255, 255, 255, 0.9)",
                        borderRadius: 12,
                        padding: "8px 10px",
                        fontSize: 13,
                        fontWeight: isSelected ? 700 : 400,
                        color: isSelected ? "rgba(37, 99, 235, 1)" : "rgba(15, 17, 21, 0.85)",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                        userSelect: "none"
                      }}
                    >
                      <span style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        border: "1px solid rgba(15, 17, 21, 0.2)",
                        background: c.hex || "#e5e7eb",
                        flexShrink: 0
                      }} />
                      <span>{c.name}</span>
                    </button>
                  )
                })}
              </div>
              <div className="form-text" style={{ marginTop: 6 }}>Seçmek için tıkla, kaldırmak için tekrar tıkla. Yeni renk için: /admin/colors</div>
            </div>

            <div className="mb-3">
              <label className="form-label">Üst Kategori</label>
              <select className="form-select" value={parentCategoryId} onChange={(e) => {
                setParentCategoryId(e.target.value)
                setChildCategoryId("")
              }}>
                <option value="">Seçiniz</option>
                {categories.filter((c) => !c.parentId).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {parentCategoryId ? (
              <div className="mb-3">
                <label className="form-label">Alt Kategori (opsiyonel)</label>
                <select className="form-select" value={childCategoryId} onChange={(e) => setChildCategoryId(e.target.value)}>
                  <option value="">Yok</option>
                  {categories.filter((c) => String(c.parentId || "") === String(parentCategoryId)).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                <div className="input-group mt-2">
                  <input className="form-control" value={newChildName} onChange={(e) => setNewChildName(e.target.value)} placeholder="Örn: 80x80" />
                  <button type="button" className="btn btn-outline-secondary" onClick={onCreateChildCategory} disabled={uploading || !newChildName.trim()}>
                    Alt Kategori Ekle
                  </button>
                </div>
                <div className="form-text">Önce üst kategori seç, sonra alt kategori oluştur.</div>
              </div>
            ) : null}

            <div className="mb-3">
              <label className="form-label">Yayın Durumu</label>
              <select className="form-select" value={published ? "1" : "0"} onChange={(e) => setPublished(e.target.value === "1")}>
                <option value="1">Açık</option>
                <option value="0">Kapalı</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Ana Görsel</label>
              <input className="form-control" type="file" accept="image/*" onChange={onPickImage(setImageMain)} disabled={uploading} />
              {imageMain ? (
                <div className="mt-2">
                  <img src={imageMain} alt="" style={{ width: "100%", borderRadius: 6 }} />
                </div>
              ) : null}
            </div>

            <div className="mb-3">
              <label className="form-label">İkinci Görsel</label>
              <input className="form-control" type="file" accept="image/*" onChange={onPickImage(setImageAlt)} disabled={uploading} />
              {imageAlt ? (
                <div className="mt-2">
                  <img src={imageAlt} alt="" style={{ width: "100%", borderRadius: 6 }} />
                </div>
              ) : null}
            </div>

            <div className="text-muted" style={{ fontSize: 13 }}>
              Not: Fiyat alanı şu an temsili (0.01).
            </div>
          </div>
        </div>
        </>
        )}

        {/* SEO Tab */}
        {activeTab === "seo" && (
          <>
            <div className="col-12 col-lg-8">
              <div className="border rounded p-3">
                <h5 className="mb-3">SEO Ayarları</h5>
                
                <div className="mb-3">
                  <label className="form-label">SEO Başlık (Title)</label>
                  <input 
                    className="form-control" 
                    value={seoTitle} 
                    onChange={(e) => setSeoTitle(e.target.value)} 
                    placeholder="Boş bırakılırsa ürün başlığı kullanılır"
                  />
                  <div className="form-text">Google arama sonuçlarında görünen başlık. Max 60 karakter önerilir.</div>
                </div>

                <div className="mb-3">
                  <label className="form-label">SEO Açıklama (Meta Description)</label>
                  <textarea 
                    className="form-control" 
                    rows={3}
                    value={seoDescription} 
                    onChange={(e) => setSeoDescription(e.target.value)} 
                    placeholder="Boş bırakılırsa ürün açıklaması kullanılır"
                  />
                  <div className="form-text">Google arama sonuçlarında görünen açıklama. Max 160 karakter önerilir.</div>
                </div>

                <div className="mb-3">
                  <label className="form-label">SEO Anahtar Kelimeler (Keywords)</label>
                  <input 
                    className="form-control" 
                    value={seoKeywords} 
                    onChange={(e) => setSeoKeywords(e.target.value)} 
                    placeholder="virgülle ayırarak yazın: jakuzi, spa, havuz"
                  />
                  <div className="form-text">Arama motorları için anahtar kelimeler (opsiyonel).</div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Canonical URL</label>
                  <input 
                    className="form-control" 
                    value={canonicalUrl} 
                    onChange={(e) => setCanonicalUrl(e.target.value)} 
                    placeholder="Boş bırakılırsa otomatik oluşturulur"
                  />
                  <div className="form-text">Bu sayfanın asıl (canonical) URL'si. Boş bırakılırsa otomatik oluşturulur.</div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Open Graph Görsel (OG Image)</label>
                  <input className="form-control" type="file" accept="image/*" onChange={onPickImage(setOgImage)} disabled={uploading} />
                  {ogImage ? (
                    <div className="mt-2">
                      <img src={ogImage} alt="OG" style={{ width: "100%", maxWidth: 300, borderRadius: 6 }} />
                      <button type="button" className="btn btn-sm btn-outline-danger mt-2" onClick={() => setOgImage("")}>Kaldır</button>
                    </div>
                  ) : null}
                  <div className="form-text">Sosyal medyada paylaşıldığında görünen görsel. 1200x630 px önerilir.</div>
                </div>

                <div className="mb-3">
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      checked={noIndex} 
                      onChange={(e) => setNoIndex(e.target.checked)} 
                      id="noIndex"
                    />
                    <label className="form-check-label" htmlFor="noIndex">
                      Arama motorlarında indekslenmesin (noindex)
                    </label>
                  </div>
                  <div className="form-text text-danger">İşaretlenirse Google bu ürünü arama sonuçlarında göstermez.</div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="border rounded p-3">
                <h6 className="mb-3">SEO Önizleme</h6>
                <div className="border rounded p-2 bg-light">
                  <div style={{ color: "#1a0dab", fontSize: 18, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {seoTitle || title || "Ürün Başlığı"}
                  </div>
                  <div style={{ color: "#006621", fontSize: 14, marginBottom: 4 }}>
                    www.ninico.com/shop/{slug || "urun-slug"}
                  </div>
                  <div style={{ color: "#545454", fontSize: 13, lineHeight: 1.4 }}>
                    {seoDescription || description?.slice(0, 160) || "Ürün açıklaması..."}
                  </div>
                </div>
                <div className="form-text mt-2">Google arama sonuçlarında böyle görünecek.</div>
              </div>
            </div>
          </>
        )}

        {/* Save Button - Always visible */}
        <div className="col-12">
          <button className="btn btn-primary" type="submit" disabled={saving || uploading}>
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  )
}
