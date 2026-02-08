export default function AdminSeoPage() {
  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-toolbar__title">SEO Ayarları</h1>
          <div className="admin-muted" style={{ fontSize: 13, marginTop: 4 }}>
            Site genel SEO ayarları ve denetimleri.
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Hazırlanıyor</div>
        <div className="admin-muted" style={{ fontSize: 13 }}>
          Bu ekranı bir sonraki adımda site genel SEO ayarları, metadata ve JSON-LD kontrolleri olarak tamamlayacağız.
        </div>
      </div>
    </div>
  )
}
