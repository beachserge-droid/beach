"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function AdminLoginPage() {
  const searchParams = useSearchParams()
  const [hasAdmin, setHasAdmin] = useState(false)
  const [dbError, setDbError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    const init = async () => {
      try {
        const [bootstrapRes, settingsRes] = await Promise.all([
          fetch("/api/admin/bootstrap"),
          fetch("/api/settings")
        ])
        
        const bootstrapData = await bootstrapRes.json()
        const settingsData = await settingsRes.json()
        
        setHasAdmin(bootstrapData.hasAdmin || false)
        if (settingsData?.ok) {
          setSettings(settingsData.settings)
        }
      } catch {
        setDbError(true)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const next = searchParams?.get("next") || "/admin"
  const error = searchParams?.get("error")
  const setupError = searchParams?.get("setupError")

  // Logo URL - önce settings'ten, yoksa fallback
  const logoUrl = settings?.logoUrl || "/assets/img/logo/logo.png"
  const siteName = settings?.siteName || "RoyalDuş"

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #fef3f3 0%, #fff5f5 50%, #fef2f2 100%)"
      }}>
        <div style={{ color: "#991b1b" }}>Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #fef3f3 0%, #fff5f5 40%, #fef2f2 100%)",
      padding: "20px",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "440px",
        background: "rgba(255, 255, 255, 0.98)",
        borderRadius: "24px",
        boxShadow: "0 25px 80px -20px rgba(0, 0, 0, 0.15), 0 10px 30px -10px rgba(220, 38, 38, 0.1)",
        overflow: "hidden",
        border: "1px solid rgba(220, 38, 38, 0.1)"
      }}>
        {/* Header Section - Koyu Kırmızı */}
        <div style={{
          background: "linear-gradient(135deg, #991b1b 0%, #b91c1c 50%, #dc2626 100%)",
          padding: "40px 32px",
          textAlign: "center",
          color: "white"
        }}>
          {/* Dinamik Logo */}
          <div style={{
            width: "100px",
            height: "100px",
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            border: "3px solid rgba(255, 255, 255, 0.3)",
            overflow: "hidden"
          }}>
            <img 
              src={logoUrl} 
              alt={siteName}
              style={{ maxWidth: "80px", maxHeight: "80px", objectFit: "contain" }}
              onError={(e) => {
                e.target.src = "/assets/img/logo/logo-white.png"
              }}
            />
          </div>
          <h1 style={{
            fontSize: "26px",
            fontWeight: "700",
            marginBottom: "8px",
            letterSpacing: "-0.5px"
          }}>
            {siteName} Yönetim
          </h1>
          <p style={{
            fontSize: "14px",
            opacity: "0.9",
            margin: 0
          }}>
            Premium Jakuzi & Spa Ürünleri
          </p>
        </div>

        {/* Body Section */}
        <div style={{ padding: "32px" }}>
          {dbError ? (
            <div style={{
              background: "rgba(220, 38, 38, 0.1)",
              border: "1px solid rgba(220, 38, 38, 0.2)",
              borderRadius: "12px",
              padding: "14px 16px",
              marginBottom: "20px",
              fontSize: "13px",
              color: "#dc2626"
            }}>
              Veritabanı bağlantısı kurulamadı. Lütfen <code>DATABASE_URL</code> ortam değişkenini kontrol edin.
            </div>
          ) : null}

          {error ? (
            <div style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "12px",
              padding: "14px 16px",
              marginBottom: "20px",
              fontSize: "13px",
              color: "#dc2626"
            }}>
              E-posta veya şifre hatalı.
            </div>
          ) : null}

          {/* Login Form */}
          <form action="/api/admin/login" method="post">
            <input type="hidden" name="next" value={next} />
            
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px"
              }}>
                E-posta Adresi
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="admin@example.com"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: "15px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "14px",
                  outline: "none",
                  transition: "all 0.2s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#dc2626"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px"
              }}>
                Şifre
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: "15px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "14px",
                  outline: "none",
                  transition: "all 0.2s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#dc2626"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "15px",
                fontWeight: "600",
                color: "white",
                background: "linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)",
                border: "none",
                borderRadius: "14px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(220, 38, 38, 0.3)"
              }}
            >
              Giriş Yap
            </button>
          </form>

          {/* Setup Section */}
          {!hasAdmin ? (
            <div style={{ marginTop: "28px" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px"
              }}>
                <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
                <span style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  İlk Kurulum
                </span>
                <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
              </div>

              {setupError ? (
                <div style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  marginBottom: "16px",
                  fontSize: "13px",
                  color: "#dc2626"
                }}>
                  Kurulum sırasında bir hata oluştu.
                </div>
              ) : null}

              <form action="/api/admin/bootstrap" method="post">
                <div style={{ marginBottom: "14px" }}>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Admin E-posta"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      fontSize: "14px",
                      border: "2px solid #e5e7eb",
                      borderRadius: "12px",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div style={{ marginBottom: "14px" }}>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={8}
                    placeholder="Şifre (min 8 karakter)"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      fontSize: "14px",
                      border: "2px solid #e5e7eb",
                      borderRadius: "12px",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div style={{ marginBottom: "14px" }}>
                  <input
                    type="password"
                    name="setupKey"
                    placeholder="Kurulum Anahtarı (opsiyonel)"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      fontSize: "14px",
                      border: "2px solid #e5e7eb",
                      borderRadius: "12px",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#dc2626",
                    background: "#fef2f2",
                    border: "2px solid #fecaca",
                    borderRadius: "12px",
                    cursor: "pointer"
                  }}
                >
                  Admin Hesabı Oluştur
                </button>
              </form>

              <p style={{
                fontSize: "12px",
                color: "#9ca3af",
                textAlign: "center",
                marginTop: "14px",
                marginBottom: 0
              }}>
                Kurulum sadece sistemde hiç admin yoksa çalışır.
              </p>
            </div>
          ) : null}

          {/* Footer */}
          <div style={{
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid #f3f4f6",
            textAlign: "center"
          }}>
            <Link href="/" style={{
              fontSize: "13px",
              color: "#dc2626",
              textDecoration: "none",
              fontWeight: "500"
            }}>
              ← Siteye Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
