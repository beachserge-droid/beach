import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { sanitizeInput, escapeHtml } from "@/lib/security"

export const runtime = "nodejs"

const validateUrl = (url) => {
  if (!url || typeof url !== "string") return null
  const sanitized = sanitizeInput(url, 2000)
  if (!sanitized.match(/^https?:\/\//i)) return null
  if (sanitized.match(/^javascript:/i)) return null
  return sanitized
}

const sanitizeHref = (href) => {
  const h = sanitizeInput(String(href || ""), 500)
  if (!h) return null
  if (h.toLowerCase().startsWith("javascript:")) return null
  return h
}

export async function GET(_request, { params }) {
  try {
    const resolvedParams = await params
    const key = resolvedParams?.key ? String(resolvedParams.key) : ""
    if (!key) return NextResponse.json({ ok: false, error: "key_required" }, { status: 400 })

    const slider = await prisma.slider.findUnique({
      where: { key },
      include: {
        slides: {
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        },
      },
    })

    if (!slider) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 })

    return NextResponse.json({ ok: true, slider })
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
    const slides = Array.isArray(body?.slides) ? body.slides.slice(0, 100) : []

    const slider = await prisma.slider.findUnique({ where: { key } })
    if (!slider) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 })

    await prisma.slide.deleteMany({ where: { sliderId: slider.id } })

    if (slides.length) {
      await prisma.slide.createMany({
        data: slides.map((s, idx) => ({
          sliderId: slider.id,
          title: escapeHtml(sanitizeInput(String(s.title || "").trim() || `Slide ${idx + 1}`, 200)),
          subtitle: s.subtitle ? escapeHtml(sanitizeInput(String(s.subtitle), 500)) : null,
          buttonLabel: s.buttonLabel ? escapeHtml(sanitizeInput(String(s.buttonLabel), 200)) : null,
          buttonHref: sanitizeHref(s.buttonHref),
          imageUrl: validateUrl(s.imageUrl) || "/assets/img/slider/banner-1.jpg",
          isActive: s.isActive === false ? false : true,
          sortOrder: Math.max(0, Math.min(9999, Number(s.sortOrder ?? idx * 10) || 0)),
        })),
      })
    }

    const updated = await prisma.slider.findUnique({
      where: { key },
      include: { slides: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] } },
    })

    return NextResponse.json({ ok: true, slider: updated })
  } catch {
    return NextResponse.json({ ok: false, error: "update_failed" }, { status: 500 })
  }
}
