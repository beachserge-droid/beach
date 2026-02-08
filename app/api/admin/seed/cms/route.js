import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

const slugify = (value) =>
  (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")

const seedMenus = async () => {
  const menus = [
    {
      key: "header_top",
      name: "Header Üst Linkler",
      items: [
        { label: "Jakuziler", href: "https://dusakabinantalya.com/", targetBlank: true, sortOrder: 10 },
        { label: "Duşakabinler", href: "https://dusakabinantalya.com/", targetBlank: true, sortOrder: 20 },
        { label: "Banyo Dolabı", href: "/shop", targetBlank: false, sortOrder: 30 },
      ],
    },
    {
      key: "header_main",
      name: "Header Ana Menü",
      items: [
        { label: "Alışveriş", href: "/shop", sortOrder: 10 },
        { label: "Blog", href: "/blog", sortOrder: 20 },
        { label: "İletişim", href: "/contact", sortOrder: 30 },
      ],
    },
    {
      key: "sidebar_categories",
      name: "Sidebar Kategori Listesi",
      items: [
        { label: "Alışveriş", href: "/shop", sortOrder: 10 },
        { label: "Blog", href: "/blog", sortOrder: 20 },
        { label: "Jakuziler", href: "https://dusakabinantalya.com/", targetBlank: true, sortOrder: 30 },
        { label: "Duşakabinler", href: "https://dusakabinantalya.com/", targetBlank: true, sortOrder: 40 },
        { label: "İletişim", href: "/contact", sortOrder: 50 },
      ],
    },
    {
      key: "mobile_product_groups",
      name: "Mobil Ürün Grupları",
      items: [
        { label: "Ürün Grupları", href: "#", isLabel: true, sortOrder: 0 },
        { label: "Jakuziler", href: "https://dusakabinantalya.com/", targetBlank: true, sortOrder: 10 },
        { label: "Duşakabinler", href: "https://dusakabinantalya.com/", targetBlank: true, sortOrder: 20 },
        { label: "Banyo Dolabı", href: "/shop", sortOrder: 30 },
      ],
    },
    {
      key: "mobile_main",
      name: "Mobil Menü",
      items: [
        { label: "Menü", href: "#", isLabel: true, sortOrder: 0 },
        { label: "Alışveriş", href: "/shop", sortOrder: 10 },
        { label: "Blog", href: "/blog", sortOrder: 20 },
        { label: "İletişim", href: "/contact", sortOrder: 30 },
      ],
    },
    {
      key: "footer_info",
      name: "Footer Bilgilendirme",
      items: [
        { label: "Müşteri Hizmetleri", href: "#", sortOrder: 10 },
        { label: "Sık Sorulan Sorular", href: "#", sortOrder: 20 },
        { label: "İletişim", href: "/contact", sortOrder: 30 },
        { label: "Etkinlikler", href: "#", sortOrder: 40 },
      ],
    },
    {
      key: "footer_account",
      name: "Footer Hesabım",
      items: [
        { label: "Teslimat Bilgileri", href: "#", sortOrder: 10 },
        { label: "Gizlilik Politikası", href: "#", sortOrder: 20 },
        { label: "İndirimler", href: "#", sortOrder: 30 },
        { label: "Şartlar ve Koşullar", href: "#", sortOrder: 40 },
      ],
    },
    {
      key: "slider_categories",
      name: "Slider Kategori Menüsü",
      items: [
        { label: "Isıtmalı Filtreli SPA Jakuziler", href: "/shop?category=isitmali-filtreli-spa-jakuziler", sortOrder: 10 },
        { label: "Dış Mekan Jakuziler", href: "/shop?category=dis-mekan-jakuziler", sortOrder: 20 },
        { label: "Açık Hava Jakuziler", href: "/shop?category=acik-hava-jakuziler", sortOrder: 30 },
        { label: "Concept Akrilik Jakuziler", href: "/shop?category=concept-akrilik-jakuziler", sortOrder: 40 },
        { label: "Bahçe & Teras Jakuziler", href: "/shop?category=bahce-teras-jakuziler", sortOrder: 50 },
        { label: "Dairesel Jakuziler", href: "/shop?category=dairesel-jakuziler", sortOrder: 60 },
        { label: "Dikdörtgen Jakuziler", href: "/shop?category=dikdortgen-jakuziler", sortOrder: 70 },
        { label: "Siyah Jakuziler", href: "/shop?category=siyah-jakuziler", sortOrder: 80 },
        { label: "Kırmızı Jakuziler", href: "/shop?category=kirmizi-jakuziler", sortOrder: 90 },
        { label: "Vitra Dikey Jakuziler", href: "/shop?category=vitra-dikey-jakuziler", sortOrder: 100 },
      ],
    },
  ]

  for (const menuSeed of menus) {
    const menu = await prisma.menu.upsert({
      where: { key: menuSeed.key },
      update: { name: menuSeed.name },
      create: { key: menuSeed.key, name: menuSeed.name },
    })

    await prisma.menuItem.deleteMany({ where: { menuId: menu.id } })

    await prisma.menuItem.createMany({
      data: menuSeed.items.map((i) => ({
        menuId: menu.id,
        label: i.label,
        href: i.href,
        targetBlank: Boolean(i.targetBlank),
        isLabel: Boolean(i.isLabel),
        isActive: true,
        sortOrder: Number(i.sortOrder || 0),
      })),
    })
  }
}

const seedSliderAndBanners = async () => {
  const slider = await prisma.slider.upsert({
    where: { key: "home_slider" },
    update: { name: "Anasayfa Slider" },
    create: { key: "home_slider", name: "Anasayfa Slider" },
  })

  await prisma.slide.deleteMany({ where: { sliderId: slider.id } })

  const slides = [
    {
      title: "Fresh Grocery\nProducts.",
      subtitle: "Quality  Fresh Products",
      buttonLabel: "Shop Now",
      buttonHref: "/shop",
      imageUrl: "/assets/img/slider/slider-05-bg-1.jpg",
      sortOrder: 10,
    },
    {
      title: "Fresh Grocery\nProducts.",
      subtitle: "Quality  Fresh Products",
      buttonLabel: "Shop Now",
      buttonHref: "/shop",
      imageUrl: "/assets/img/slider/slider-05-bg-2.jpg",
      sortOrder: 20,
    },
    {
      title: "Fresh Grocery\nProducts.",
      subtitle: "Quality  Fresh Products",
      buttonLabel: "Shop Now",
      buttonHref: "/shop",
      imageUrl: "/assets/img/slider/slider-05-bg-3.jpg",
      sortOrder: 30,
    },
    {
      title: "Fresh Grocery\nProducts.",
      subtitle: "Quality  Fresh Products",
      buttonLabel: "Shop Now",
      buttonHref: "/shop",
      imageUrl: "/assets/img/slider/slider-05-bg-4.jpg",
      sortOrder: 40,
    },
  ]

  await prisma.slide.createMany({
    data: slides.map((s) => ({
      sliderId: slider.id,
      title: s.title,
      subtitle: s.subtitle,
      buttonLabel: s.buttonLabel,
      buttonHref: s.buttonHref,
      imageUrl: s.imageUrl,
      isActive: true,
      sortOrder: s.sortOrder,
    })),
  })

  const sliderSide = await prisma.bannerGroup.upsert({
    where: { key: "home_slider_side" },
    update: { name: "Slider Yan Bannerlar" },
    create: { key: "home_slider_side", name: "Slider Yan Bannerlar" },
  })

  await prisma.banner.deleteMany({ where: { bannerGroupId: sliderSide.id } })

  await prisma.banner.createMany({
    data: [
      {
        bannerGroupId: sliderSide.id,
        imageUrl: "/assets/img/slider/slider-05-banner-1.jpg",
        alt: "Slider side 1",
        title: "100% Fresh Product\nEvery Hour",
        subtitle: "Best Bakery Products",
        href: "/shop",
        variant: "slider_side",
        isActive: true,
        sortOrder: 10,
      },
      {
        bannerGroupId: sliderSide.id,
        imageUrl: "/assets/img/slider/slider-05-banner-2.jpg",
        alt: "Slider side 2",
        title: "100% Fresh Product\nEvery Hour",
        subtitle: "Best Bakery Products",
        href: "/shop",
        variant: "slider_side_white",
        isActive: true,
        sortOrder: 20,
      },
    ],
  })

  const homeBanners = await prisma.bannerGroup.upsert({
    where: { key: "home_banners" },
    update: { name: "Anasayfa Bannerlar" },
    create: { key: "home_banners", name: "Anasayfa Bannerlar" },
  })

  await prisma.banner.deleteMany({ where: { bannerGroupId: homeBanners.id } })

  await prisma.banner.createMany({
    data: [
      {
        bannerGroupId: homeBanners.id,
        imageUrl: "/assets/img/banner/banner-03-01.jpg",
        alt: "Banner 1",
        href: null,
        variant: "home",
        isActive: true,
        sortOrder: 10,
      },
      {
        bannerGroupId: homeBanners.id,
        imageUrl: "/assets/img/banner/banner-bg-05.jpg",
        alt: "Banner 2",
        href: null,
        variant: "home",
        isActive: true,
        sortOrder: 20,
      },
    ],
  })

  const homeServices = await prisma.bannerGroup.upsert({
    where: { key: "home_services" },
    update: { name: "Anasayfa Servis Şeridi" },
    create: { key: "home_services", name: "Anasayfa Servis Şeridi" },
  })

  await prisma.banner.deleteMany({ where: { bannerGroupId: homeServices.id } })

  await prisma.banner.createMany({
    data: [
      {
        bannerGroupId: homeServices.id,
        imageUrl: "/assets/img/svg/services05.svg",
        alt: "Free shipping",
        title: "Free shipping",
        subtitle: "Free shipping orders over $65.",
        href: null,
        variant: "service",
        isActive: true,
        sortOrder: 10,
      },
      {
        bannerGroupId: homeServices.id,
        imageUrl: "/assets/img/svg/services06.svg",
        alt: "Free Returns",
        title: "Free Returns",
        subtitle: "30-days free return policy",
        href: null,
        variant: "service",
        isActive: true,
        sortOrder: 20,
      },
      {
        bannerGroupId: homeServices.id,
        imageUrl: "/assets/img/svg/services07.svg",
        alt: "Secured Payments",
        title: "Secured Payments",
        subtitle: "We accept all major credit cards",
        href: null,
        variant: "service",
        isActive: true,
        sortOrder: 30,
      },
      {
        bannerGroupId: homeServices.id,
        imageUrl: "/assets/img/svg/services08.svg",
        alt: "Customer Service",
        title: "Customer Service",
        subtitle: "Top notch customer setvice",
        href: null,
        variant: "service",
        isActive: true,
        sortOrder: 40,
      },
    ],
  })

  const servicesSection = await prisma.bannerGroup.upsert({
    where: { key: "services_section" },
    update: { name: "Services Bölümü" },
    create: { key: "services_section", name: "Services Bölümü" },
  })

  await prisma.banner.deleteMany({ where: { bannerGroupId: servicesSection.id } })

  await prisma.banner.createMany({
    data: [
      {
        bannerGroupId: servicesSection.id,
        imageUrl: "/assets/img/svg/services01.svg",
        alt: "Free shipping",
        title: "Free shipping",
        subtitle: "Free shipping on orders over.",
        href: null,
        variant: "service",
        isActive: true,
        sortOrder: 10,
      },
      {
        bannerGroupId: servicesSection.id,
        imageUrl: "/assets/img/svg/services02.svg",
        alt: "Free Returns",
        title: "Free Returns",
        subtitle: "30-days free return policy",
        href: null,
        variant: "service",
        isActive: true,
        sortOrder: 20,
      },
      {
        bannerGroupId: servicesSection.id,
        imageUrl: "/assets/img/svg/services03.svg",
        alt: "Secured Payments",
        title: "Secured Payments",
        subtitle: "We accept all major credit cards",
        href: null,
        variant: "service",
        isActive: true,
        sortOrder: 30,
      },
      {
        bannerGroupId: servicesSection.id,
        imageUrl: "/assets/img/svg/services04.svg",
        alt: "Customer Service",
        title: "Customer Service",
        subtitle: "Top notch customer setvice",
        href: null,
        variant: "service",
        isActive: true,
        sortOrder: 40,
      },
    ],
  })

  const productInfoBoxes = await prisma.bannerGroup.upsert({
    where: { key: "product_info_boxes" },
    update: { name: "Ürün Detay Bilgi Kutuları" },
    create: { key: "product_info_boxes", name: "Ürün Detay Bilgi Kutuları" },
  })

  await prisma.banner.deleteMany({ where: { bannerGroupId: productInfoBoxes.id } })

  await prisma.banner.createMany({
    data: [
      {
        bannerGroupId: productInfoBoxes.id,
        imageUrl: "/assets/img/icon/product-det-1.png",
        alt: "Free Shipping",
        title: "Free Shipping apply to all",
        subtitle: "orders over $100",
        href: null,
        variant: "",
        isActive: true,
        sortOrder: 10,
      },
      {
        bannerGroupId: productInfoBoxes.id,
        imageUrl: "/assets/img/icon/product-det-2.png",
        alt: "Guranteed 100% Organic",
        title: "Guranteed 100% Organic",
        subtitle: "from natural farmas",
        href: null,
        variant: "",
        isActive: true,
        sortOrder: 20,
      },
      {
        bannerGroupId: productInfoBoxes.id,
        imageUrl: "/assets/img/icon/product-det-3.png",
        alt: "1 Day Returns",
        title: "1 Day Returns if you change",
        subtitle: "your mind",
        href: null,
        variant: "",
        isActive: true,
        sortOrder: 30,
      },
      {
        bannerGroupId: productInfoBoxes.id,
        imageUrl: "/assets/img/icon/product-det-4.png",
        alt: "Covid-19 Info",
        title: "Covid-19 Info: We keep",
        subtitle: "delivering.",
        href: null,
        variant: "",
        isActive: true,
        sortOrder: 40,
      },
    ],
  })
}

const seedCategoryIcons = async () => {
  const iconMap = [
    { name: "Kırmızı Jakuziler", icon: "kırmızıjakuzi.png", order: 10 },
    { name: "SPA Jakuzi", icon: "spajakuzi.png", order: 20 },
    { name: "Dış Mekan Jakuziler", icon: "dış mekan jakuzi.png", order: 30 },
    { name: "Bahçe & Teras Jakuziler", icon: "bahce teras.png", order: 40 },
    { name: "Açık Hava Jakuziler", icon: "açık hava .png", order: 50 },
    { name: "Dikdörtgen Jakuziler", icon: "dikdörtgen.png", order: 60 },
    { name: "Dairesel Jakuziler", icon: "dairesel.png", order: 70 },
    { name: "Concept Akrilik Jakuziler", icon: "concept akrilik.png", order: 80 },
    { name: "Siyah Jakuziler", icon: "siyah.png", order: 90 },
    { name: "Yedek Parça", icon: "yedek parça .png", order: 100 },
    { name: "Isıtmalı Filtreli SPA Jakuziler", icon: null, order: 15 },
    { name: "Vitra Dikey Jakuziler", icon: null, order: 110 },
  ]

  for (const c of iconMap) {
    const slug = slugify(c.name)
    await prisma.category.upsert({
      where: { slug },
      update: { name: c.name, iconImage: c.icon, sortOrder: c.order },
      create: { name: c.name, slug, iconImage: c.icon, sortOrder: c.order },
    })
  }
}

export async function POST() {
  try {
    await seedMenus()
    await seedSliderAndBanners()
    await seedCategoryIcons()

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: "seed_failed" }, { status: 500 })
  }
}
