'use client'

import { useState } from "react"

export default function FixCategorySlugsButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const onRun = async () => {
    setMessage("")
    setLoading(true)
    try {
      const res = await fetch("/api/admin/cleanup/fix-category-slugs", { method: "POST" })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.ok) {
        const err = json?.error ? String(json.error) : "fix_failed"
        throw new Error(err)
      }
      setMessage(`Düzeltildi: ${json.fixed} (numeric: ${json.numeric})`)
      window.location.reload()
    } catch (e) {
      const msg = e && typeof e === "object" && "message" in e ? String(e.message) : "fix_failed"
      setMessage(`Düzeltme başarısız: ${msg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex align-items-center gap-2">
      <button type="button" className="btn btn-outline-warning btn-sm" onClick={onRun} disabled={loading}>
        {loading ? "Düzeltiliyor..." : "Numeric Slug Düzelt"}
      </button>
      {message ? <span className="text-muted" style={{ fontSize: 13 }}>{message}</span> : null}
    </div>
  )
}
