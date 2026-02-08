import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET(_request, { params }) {
  try {
    const resolvedParams = await params
    const key = resolvedParams?.key ? String(resolvedParams.key) : ""
    if (!key) return NextResponse.json({ ok: false, error: "key_required" }, { status: 400 })

    const group = await prisma.bannerGroup.upsert({
      where: { key },
      create: { key, name: key },
      update: {},
      include: {
        banners: {
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        },
      },
    })

    return NextResponse.json({ ok: true, group })
  } catch {
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params
    const key = resolvedParams?.key ? String(resolvedParams.key) : ""
    if (!key) return NextResponse.json({ ok: false, error: "key_required" }, { status: 400 })

    const body = await request.json().catch(() => null)
    const banners = Array.isArray(body?.banners) ? body.banners : []

    const group = await prisma.bannerGroup.upsert({
      where: { key },
      create: { key, name: key },
      update: {},
    })

    await prisma.banner.deleteMany({ where: { bannerGroupId: group.id } })

    if (banners.length) {
      await prisma.banner.createMany({
        data: banners.map((b, idx) => ({
          bannerGroupId: group.id,
          imageUrl: String(b.imageUrl || "").trim() || "/assets/img/banner/banner-03-01.jpg",
          alt: b.alt ? String(b.alt) : null,
          title: b.title ? String(b.title) : null,
          subtitle: b.subtitle ? String(b.subtitle) : null,
          href: b.href ? String(b.href) : null,
          variant: b.variant ? String(b.variant) : null,
          isActive: b.isActive === false ? false : true,
          sortOrder: Number(b.sortOrder ?? idx * 10) || 0,
        })),
      })
    }

    const updated = await prisma.bannerGroup.findUnique({
      where: { key },
      include: { banners: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] } },
    })

    return NextResponse.json({ ok: true, group: updated })
  } catch {
    return NextResponse.json({ ok: false, error: "update_failed" }, { status: 500 })
  }
}
