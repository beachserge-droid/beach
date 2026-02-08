'use client'

import { useState } from "react"

export default function CleanupTestProductsButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const onCleanup = async () => {
    setMessage("")
    setLoading(true)
    try {
      const res = await fetch("/api/admin/cleanup/test-products", { method: "POST" })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.ok) throw new Error("cleanup_failed")
      setMessage(`${json.deleted} test ürün silindi.`)
      window.location.reload()
    } catch {
      setMessage("Temizleme başarısız.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex align-items-center gap-2">
      <button type="button" className="btn btn-outline-danger btn-sm" onClick={onCleanup} disabled={loading}>
        {loading ? "Siliniyor..." : "Test Ürünleri Sil"}
      </button>
      {message ? <span className="text-muted" style={{ fontSize: 13 }}>{message}</span> : null}
    </div>
  )
}
