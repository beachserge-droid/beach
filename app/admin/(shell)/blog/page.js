"use client"

import React from "react"
import Link from "next/link"

export default function AdminBlogPage() {
  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-toolbar__title">Blog</h1>
          <div className="admin-muted" style={{ fontSize: 13, marginTop: 4 }}>
            Yazıları buradan yönetebilirsin.
          </div>
        </div>
        <div className="admin-toolbar__actions">
          <Link href="/admin/blog/categories" className="admin-btn">Kategoriler</Link>
          <Link href="/admin/blog/posts/new" className="admin-btn">Yeni Yazı</Link>
        </div>
      </div>

      <BlogPostsTable />
    </div>
  )
}

function BlogPostsTable() {
  const [posts, setPosts] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const load = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/blog/posts")
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.ok) throw new Error("load_failed")
      setPosts(json.posts || [])
    } catch {
      setError("Yazılar yüklenemedi.")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    load().catch(() => {})
  }, [])

  const onDelete = (id) => async () => {
    const ok = window.confirm("Yazıyı silmek istiyor musun?")
    if (!ok) return
    setError("")
    try {
      const res = await fetch(`/api/admin/blog/posts/${encodeURIComponent(String(id))}`, { method: "DELETE" })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.ok) throw new Error("delete_failed")
      await load()
    } catch {
      setError("Silinemedi.")
    }
  }

  if (loading) return <div className="admin-muted">Yükleniyor...</div>

  return (
    <>
      {error ? <div className="admin-alert" style={{ marginBottom: 12 }}>{error}</div> : null}
      <div className="admin-table-wrap">
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Başlık</th>
                <th>Slug</th>
                <th>Kategori</th>
                <th>Yayın</th>
                <th className="is-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link className="admin-link" href={`/admin/blog/posts/${p.id}`}>{p.title}</Link>
                    <div className="admin-muted" style={{ fontSize: 12, marginTop: 3 }}>ID: {p.id}</div>
                  </td>
                  <td className="is-muted">/{p.slug}</td>
                  <td className="is-muted">{p.category?.name || "-"}</td>
                  <td>
                    {p.published ? (
                      <span className="admin-badge admin-badge--success">Açık</span>
                    ) : (
                      <span className="admin-badge admin-badge--danger">Kapalı</span>
                    )}
                  </td>
                  <td className="is-right">
                    <div className="admin-inline-actions">
                      <Link href={`/admin/blog/posts/${p.id}`} className="admin-btn">Düzenle</Link>
                      <a href={`/blog/${encodeURIComponent(p.slug)}`} className="admin-btn" target="_blank" rel="noreferrer">Görüntüle</a>
                      <button type="button" className="admin-btn admin-btn--danger" onClick={onDelete(p.id)}>Sil</button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="is-muted" style={{ padding: 18 }}>Henüz blog yazısı yok.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
