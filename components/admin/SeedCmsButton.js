'use client'

import { useState } from "react"

export default function SeedCmsButton() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")

  const onSeed = async () => {
    setMsg("")
    setLoading(true)
    try {
      const res = await fetch("/api/admin/seed/cms", { method: "POST" })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.ok) throw new Error("seed_failed")
      setMsg("Demo içerikler DB'ye aktarıldı.")
      window.location.reload()
    } catch {
      setMsg("Aktarım başarısız.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex align-items-center gap-2">
      <button type="button" className="btn btn-outline-primary btn-sm" onClick={onSeed} disabled={loading}>
        {loading ? "Aktarılıyor..." : "Demo İçerikleri DB'ye Aktar"}
      </button>
      {msg ? <span className="text-muted" style={{ fontSize: 13 }}>{msg}</span> : null}
    </div>
  )
}
