'use client'

import { useState } from "react"

export default function DeleteProductButton({ id }) {
  const [loading, setLoading] = useState(false)

  const onDelete = async () => {
    const ok = window.confirm("Bu ürünü silmek istiyor musun?")
    if (!ok) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(String(id))}`, {
        method: "DELETE",
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.ok) throw new Error("delete_failed")
      window.location.reload()
    } catch {
      alert("Silme başarısız.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button type="button" className="btn btn-outline-danger btn-sm" onClick={onDelete} disabled={loading}>
      {loading ? "Siliniyor..." : "Sil"}
    </button>
  )
}
