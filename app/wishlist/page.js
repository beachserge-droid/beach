
import WishlistItems from "@/components/elements/WishlistItems"
import Layout from "@/components/layout/Layout"
export default function Wishlist() {

    return (
        <>
            <Layout breadcrumbTitle="Favoriler">
                <div className="cart-area pt-80 pb-80 wow fadeInUp" data-wow-duration=".8s" data-wow-delay=".2s">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <form action="#">
                                    <div className="table-content table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th className="product-thumbnail">Görsel</th>
                                                    <th className="cart-product-name">Ürün</th>
                                                    <th className="product-price">Birim Fiyat</th>
                                                    <th className="product-quantity">Adet</th>
                                                    <th className="product-subtotal">Toplam</th>
                                                    <th className="product-add-to-cart">Sepete Ekle</th>
                                                    <th className="product-remove">Kaldır</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <WishlistItems />
                                            </tbody>
                                        </table>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </Layout>
        </>
    )
}