'use client'

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"

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

export default function AdminProductNewPage() {
  const router = useRouter()
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

  const [categories, setCategories] = useState([])
  const [parentCategoryId, setParentCategoryId] = useState("")
  const [childCategoryId, setChildCategoryId] = useState("")
  const [newChildName, setNewChildName] = useState("")

  const [colors, setColors] = useState([])
  const [colorIds, setColorIds] = useState([])

  const [tagText, setTagText] = useState("")
  const [specs, setSpecs] = useState([{ key: "", value: "", sortOrder: 10 }])
  const [images, setImages] = useState([])
  const [features, setFeatures] = useState([])
  const [infoBoxes, setInfoBoxes] = useState([])

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const priceMax = "0.01"

  const autoSlug = useMemo(() => slugify(title), [title])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const [catRes, colorRes] = await Promise.all([
          fetch("/api/admin/categories"),
          fetch("/api/admin/colors"),
        ])

        const catJson = catRes.ok ? await catRes.json().catch(() => null) : null
        if (catJson?.ok && Array.isArray(catJson.categories) && !cancelled) setCategories(catJson.categories)

        const colorJson = colorRes.ok ? await colorRes.json().catch(() => null) : null
        if (colorJson?.ok && Array.isArray(colorJson.colors) && !cancelled) setColors(colorJson.colors)
      } catch {
        return
      }
    }

    run()
    return () => { cancelled = true }
  }, [])

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
      setError("Görsel yüklenemedi.")
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
    setError("")
    setUploading(true)
    try {
      const url = await uploadFile(file)
      setVideoUrl(url)
    } catch {
      setError("Video yüklenemedi.")
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
    if (!json?.url) throw new Error("upload_failed")
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
    setError("")
    setUploading(true)
    try {
      const url = await uploadFile(file)
      setInfoBoxes((prev) => prev.map((b, i) => i === idx ? { ...b, iconUrl: url } : b))
    } catch {
      setError("Görsel yüklenemedi.")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const onPickFeatureImage = (idx) => async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError("")
    setUploading(true)
    try {
      const url = await uploadFile(file)
      setFeatures((prev) => prev.map((f, i) => i === idx ? { ...f, imageUrl: url } : f))
    } catch {
      setError("Görsel yüklenemedi.")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const onAddDescriptionImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError("")
    setUploading(true)
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
      setError("Görsel yüklenemedi.")
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

    setError("")
    setUploading(true)
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

  const onPickMain = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError("")
    setUploading(true)
    try {
      const url = await uploadFile(file)
      setImageMain(url)
    } catch {
      setError("Görsel yüklenemedi.")
    } finally {
      setUploading(false)
    }
  }

  const onPickAlt = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError("")
    setUploading(true)
    try {
      const url = await uploadFile(file)
      setImageAlt(url)
    } catch {
      setError("Görsel yüklenemedi.")
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
        .split(/[,\n]/g)
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

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: finalSlug,
          sku: sku.trim() || null,
          description: description.trim() || null,
          videoUrl: videoUrl.trim() || null,
          categoryId: categoryId ? Number(categoryId) : null,
          published,
          priceMin: priceMax,
          priceMax,
          imageMain: imageMain || null,
          imageAlt: imageAlt || null,
          colorIds,
          tags,
          specs: finalSpecs,
          images: finalImages,
          features: features
            .map((f, idx) => ({
              imageUrl: String(f.imageUrl || "").trim(),
              title: String(f.title || "").trim(),
              subtitle: f.subtitle ? String(f.subtitle) : null,
              isActive: f.isActive === false ? false : true,
              sortOrder: Number(f.sortOrder ?? (idx + 1) * 10),
            }))
            .filter((f) => f.title && f.imageUrl),
          infoBoxes: infoBoxes
            .map((b, idx) => ({
              iconUrl: String(b.iconUrl || "").trim(),
              title: String(b.title || "").trim(),
              subtitle: b.subtitle ? String(b.subtitle) : null,
              color: b.color ? String(b.color) : null,
              isActive: b.isActive === false ? false : true,
              sortOrder: Number(b.sortOrder ?? (idx + 1) * 10),
            }))
            .filter((b) => b.title),
        }),
      })

      if (!res.ok) throw new Error("save_failed")

      router.push("/admin/products")
      router.refresh()
    } catch {
      setError("Kaydedilemedi. (Slug zaten var olabilir)")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-toolbar__title">Yeni Ürün</h1>
          <div className="admin-muted" style={{ fontSize: 13, marginTop: 4 }}>
            Ürün içeriğini oluştur, görselleri yükle ve yayın durumunu ayarla.
          </div>
        </div>
        <div className="admin-toolbar__actions">
          <button className="admin-btn" type="submit" form="adminProductNewForm" disabled={saving || uploading}>
            {saving ? "Kaydediliyor..." : uploading ? "Yükleniyor..." : "Kaydet"}
          </button>
        </div>
      </div>

      {error ? <div className="admin-alert" style={{ marginTop: 12 }}>{error}</div> : null}

      <form id="adminProductNewForm" onSubmit={onSave} style={{ marginTop: 12 }}>
        <div className="row g-3">
          <div className="col-12 col-lg-8">
            <div className="mb-3">
              <label className="form-label">Başlık</label>
              <input
                className="form-control"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (!slug) setSlug(slugify(e.target.value))
                }}
                placeholder="Ürün adı"
                required
              />
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
              <label className="form-label">SKU</label>
              <input className="form-control" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Örn: SPA-8080" />
            </div>

            <div className="mb-3">
              <label className="form-label">Slug</label>
              <input
                className="form-control"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder={autoSlug || "urun-slug"}
                required
              />
              <div className="form-text">URL: /shop/&lt;slug&gt; (sonra bağlayacağız)</div>
            </div>

            <div className="mb-3">
              <label className="form-label">Açıklama</label>
              <div className="mb-2">
                <input className="form-control" type="file" accept="image/*" onChange={onAddDescriptionImage} disabled={uploading} />
                <div className="form-text">Görsel yükleyip açıklamaya &lt;img&gt; olarak ekler. (Frontend açıklamayı HTML olarak basar.)</div>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input" type="checkbox" checked={askCaptions} onChange={(e) => setAskCaptions(e.target.checked)} id="askCaptions" />
                <label className="form-check-label" htmlFor="askCaptions">Görsel ekledikten sonra caption alanına imleci getir</label>
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
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ürün açıklaması"
                ref={descriptionRef}
              />
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
                <label className="form-label">Fiyat (Temsili)</label>
                <input className="form-control" value={`${priceMax} TRY`} disabled />
              </div>

              <div className="mb-3">
                <label className="form-label">Ana Görsel</label>
                <input className="form-control" type="file" accept="image/*" onChange={onPickMain} disabled={uploading} />
                {imageMain ? (
                  <div className="mt-2">
                    <img src={imageMain} alt="preview" className="img-fluid rounded" />
                  </div>
                ) : null}
              </div>

              <div className="mb-3">
                <label className="form-label">İkinci Görsel</label>
                <input className="form-control" type="file" accept="image/*" onChange={onPickAlt} disabled={uploading} />
                {imageAlt ? (
                  <div className="mt-2">
                    <img src={imageAlt} alt="preview" className="img-fluid rounded" />
                  </div>
                ) : null}
              </div>

              <button className="btn btn-primary w-100" type="submit" disabled={saving || uploading}>
                {saving ? "Kaydediliyor..." : uploading ? "Yükleniyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
