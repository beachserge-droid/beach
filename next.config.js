/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: {
        buildActivity: false,
        appIsrStatus: false,
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains; preload',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; media-src 'self' https:; frame-src 'self' https://www.youtube.com https://player.vimeo.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;",
                    },
                ],
            },
        ]
    },
    async redirects() {
        return [
            { source: "/index-2", destination: "/", permanent: true },
            { source: "/index-3", destination: "/", permanent: true },
            { source: "/index-4", destination: "/", permanent: true },
            { source: "/index-5", destination: "/", permanent: true },

            { source: "/about", destination: "/", permanent: true },
            { source: "/faq", destination: "/", permanent: true },
            { source: "/services", destination: "/", permanent: true },
            { source: "/track", destination: "/", permanent: true },
            { source: "/sign-in", destination: "/", permanent: true },
            { source: "/coming-soon", destination: "/", permanent: true },
            { source: "/blog-details", destination: "/blog/1", permanent: true },

            { source: "/shop-2", destination: "/shop", permanent: true },
            { source: "/shop-location", destination: "/shop", permanent: true },
            { source: "/shop-details", destination: "/shop", permanent: true },
            { source: "/shop-details-2", destination: "/shop", permanent: true },

            {
                source: "/shop",
                has: [{ type: "query", key: "category" }],
                destination: "/category/:category",
                permanent: true,
            },
        ]
    },
}

module.exports = nextConfig
