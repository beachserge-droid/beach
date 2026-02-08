import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } })
  return NextResponse.json({ ok: true, settings })
}

export async function PUT(request) {
  try {
    const body = await request.json().catch(() => ({}))

    const data = {
      siteName: body.siteName ? String(body.siteName) : undefined,
      logoUrl: body.logoUrl ? String(body.logoUrl) : null,
      headerPhone: body.headerPhone ? String(body.headerPhone) : null,
      headerEmail: body.headerEmail ? String(body.headerEmail) : null,
      footerAbout: body.footerAbout ? String(body.footerAbout) : null,
      footerPhone: body.footerPhone ? String(body.footerPhone) : null,
      footerWorkHours: body.footerWorkHours ? String(body.footerWorkHours) : null,
      socialFacebook: body.socialFacebook ? String(body.socialFacebook) : null,
      socialInstagram: body.socialInstagram ? String(body.socialInstagram) : null,
      socialYoutube: body.socialYoutube ? String(body.socialYoutube) : null,
      socialX: body.socialX ? String(body.socialX) : null,
      // SEO Fields
      defaultSeoTitle: body.defaultSeoTitle ? String(body.defaultSeoTitle) : null,
      defaultSeoDescription: body.defaultSeoDescription ? String(body.defaultSeoDescription) : null,
      defaultSeoKeywords: body.defaultSeoKeywords ? String(body.defaultSeoKeywords) : null,
      siteUrl: body.siteUrl ? String(body.siteUrl) : null,
      googleVerification: body.googleVerification ? String(body.googleVerification) : null,
      googleAnalyticsId: body.googleAnalyticsId ? String(body.googleAnalyticsId) : null,
    }

    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: data,
      create: {
        id: 1,
        siteName: data.siteName || "Catalog",
        logoUrl: data.logoUrl,
        headerPhone: data.headerPhone,
        headerEmail: data.headerEmail,
        footerAbout: data.footerAbout,
        footerPhone: data.footerPhone,
        footerWorkHours: data.footerWorkHours,
        socialFacebook: data.socialFacebook,
        socialInstagram: data.socialInstagram,
        socialYoutube: data.socialYoutube,
        socialX: data.socialX,
        // SEO Fields
        defaultSeoTitle: data.defaultSeoTitle,
        defaultSeoDescription: data.defaultSeoDescription,
        defaultSeoKeywords: data.defaultSeoKeywords,
        siteUrl: data.siteUrl,
        googleVerification: data.googleVerification,
        googleAnalyticsId: data.googleAnalyticsId,
      },
    })

    return NextResponse.json({ ok: true, settings })
  } catch {
    return NextResponse.json({ ok: false, error: "update_failed" }, { status: 500 })
  }
}
