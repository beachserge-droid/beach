export default function AdminLeadsPage() {
  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-toolbar__title">Leads</h1>
          <div className="admin-muted" style={{ fontSize: 13, marginTop: 4 }}>
            Form talepleri ve iletileri.
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Hazırlanıyor</div>
        <div className="admin-muted" style={{ fontSize: 13 }}>
          Bu ekranı bir sonraki adımda gelen talepleri/lead'leri listeleyen ekran olarak tamamlayacağız.
        </div>
      </div>
    </div>
  )
}
