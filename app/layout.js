import { Jost } from 'next/font/google'
import "react-toastify/dist/ReactToastify.css";
import Providers from "./providers"
import "../public/assets/css/animate.css"
import "../public/assets/css/bootstrap.min.css"
import "../public/assets/css/fontawesome.min.css"
import "../public/assets/css/nice-select.css"
import "../public/assets/css/slick.css"
import "../public/assets/css/swiper-bundle.css"
import "../public/assets/css/magnific-popup.css"
import "../public/assets/css/meanmenu.css"
import "../public/assets/css/spacing.css"
import "../public/assets/css/main.css"
import "../public/assets/css/product-hover-fix.css"

const jost = Jost({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    variable: "--tp-ff-body",
})

export const metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: {
        default: "Ninico - Premium Jakuzi ve Spa Ürünleri",
        template: "%s | Ninico",
    },
    description: "Premium jakuzi, spa ve wellness ürünleri. En kaliteli ürünler, profesyonel hizmet ve uygun fiyatlarla Ninico'da.",
    keywords: ["jakuzi", "spa", "wellness", "havluz", "premium"],
    authors: [{ name: "Ninico" }],
    creator: "Ninico",
    publisher: "Ninico",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "tr_TR",
        url: "/",
        siteName: "Ninico",
        title: "Ninico - Premium Jakuzi ve Spa Ürünleri",
        description: "Premium jakuzi, spa ve wellness ürünleri. En kaliteli ürünler, profesyonel hizmet ve uygun fiyatlarla.",
    },
    twitter: {
        card: "summary_large_image",
        title: "Ninico - Premium Jakuzi ve Spa Ürünleri",
        description: "Premium jakuzi, spa ve wellness ürünleri.",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    },
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ninico",
    url: siteUrl,
    potentialAction: {
        "@type": "SearchAction",
        target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/shop?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
    },
}

const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ninico",
    url: siteUrl,
    logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/assets/img/logo/logo.png`,
    },
    sameAs: [
        process.env.NEXT_PUBLIC_FACEBOOK_URL,
        process.env.NEXT_PUBLIC_INSTAGRAM_URL,
        process.env.NEXT_PUBLIC_TWITTER_URL,
        process.env.NEXT_PUBLIC_YOUTUBE_URL,
    ].filter(Boolean),
}

export default function RootLayout({ children }) {
    return (
        <html lang="tr">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
                />
            </head>
            <body className={`${jost.variable}`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
