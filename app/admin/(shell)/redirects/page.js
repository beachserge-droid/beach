export default function AdminRedirectsPage() {
  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-toolbar__title">Redirects</h1>
          <div className="admin-muted" style={{ fontSize: 13, marginTop: 4 }}>
            301/302 yönlendirmelerini buradan yöneteceksin.
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Hazırlanıyor</div>
        <div className="admin-muted" style={{ fontSize: 13 }}>
          Bu ekranı bir sonraki adımda redirect listesi + ekleme formu + import/export ile tamamlayacağız.
        </div>
      </div>
    </div>
  )
}
