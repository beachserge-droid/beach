export default function robots() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                // Admin paths
                "/admin",
                "/api/admin",
                // Staging/Demo paths
                "/index-2",
                "/index-3",
                "/index-4",
                "/index-5",
                "/shop-2",
                "/shop-details",
                "/shop-details-2",
                "/shop-location",
                // Cart/Checkout/Wishlist - functional pages, not for indexing
                "/cart",
                "/checkout",
                "/wishlist",
                // API routes
                "/api/",
                // Query parameters that create duplicate content
                "/shop?*",
                "/blog?*",
            ],
        },
        sitemap: `${siteUrl}/sitemap.xml`,
        host: siteUrl,
    }
}
