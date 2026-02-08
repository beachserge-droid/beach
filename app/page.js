import Layout from "@/components/layout/Layout"
import Blog4 from "@/components/sections/Blog4"
import Category from "@/components/sections/Category"
import HomeBanners from "@/components/sections/HomeBanners"
import HomeCategoryProductRows from "@/components/sections/HomeCategoryProductRows"
import Slider5 from "@/components/sections/Slider5"

export const metadata = {
  title: "Premium Jakuzi ve Spa Ürünleri - Ninico",
  description: "Ninico'da premium jakuzi, spa ve wellness ürünleri keşfedin. En kaliteli ürünler, profesyonel hizmet ve uygun fiyatlarla evinize konfor getirin.",
  keywords: ["jakuzi", "spa", "wellness", "havluz", "premium jakuzi", "ev spa"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Premium Jakuzi ve Spa Ürünleri - Ninico",
    description: "Ninico'da premium jakuzi, spa ve wellness ürünleri keşfedin.",
    url: "/",
    type: "website",
  },
}

export default function Home() {
  return (
    <>
      <Layout>
        <Slider5 />
        <Category />
        <HomeBanners />
        <HomeCategoryProductRows />
        <Blog4 />
      </Layout>
    </>
  )
}