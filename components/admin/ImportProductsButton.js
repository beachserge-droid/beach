'use client'

import { useState } from "react"

export default function ImportProductsButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const onImport = async () => {
    setMessage("")
    setLoading(true)
    try {
      const res = await fetch("/api/admin/import/products", { method: "POST" })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.ok) throw new Error("import_failed")
      setMessage(`${json.imported} ürün aktarıldı.`)
      window.location.reload()
    } catch {
      setMessage("Aktarım başarısız.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex align-items-center gap-2">
      <button type="button" className="btn btn-outline-primary btn-sm" onClick={onImport} disabled={loading}>
        {loading ? "Aktarılıyor..." : "JSON’dan 10 Ürün Aktar"}
      </button>
      {message ? <span className="text-muted" style={{ fontSize: 13 }}>{message}</span> : null}
    </div>
  )
}
