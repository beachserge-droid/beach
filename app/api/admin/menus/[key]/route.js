import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { sanitizeInput, escapeHtml } from "@/lib/security"

export const runtime = "nodejs"

const sanitizeHref = (href) => {
  const h = sanitizeInput(String(href || ""), 500)
  if (!h) return "#"
  if (h.toLowerCase().startsWith("javascript:")) return "#"
  return h
}

export async function GET(_request, { params }) {
  try {
    const resolvedParams = await params
    const key = resolvedParams?.key ? String(resolvedParams.key) : ""
    if (!key) return NextResponse.json({ ok: false, error: "key_required" }, { status: 400 })

    const menu = await prisma.menu.findUnique({
      where: { key },
      include: {
        items: {
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        },
      },
    })

    if (!menu) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 })

    return NextResponse.json({ ok: true, menu })
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
    const items = Array.isArray(body?.items) ? body.items.slice(0, 500) : []

    const menu = await prisma.menu.findUnique({ where: { key } })
    if (!menu) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 })

    await prisma.menuItem.deleteMany({ where: { menuId: menu.id } })

    if (items.length) {
      await prisma.menuItem.createMany({
        data: items.map((i, idx) => ({
          menuId: menu.id,
          label: escapeHtml(sanitizeInput(String(i.label || "").trim() || `Item ${idx + 1}`, 200)),
          href: sanitizeHref(i.href),
          targetBlank: Boolean(i.targetBlank),
          isLabel: Boolean(i.isLabel),
          isActive: i.isActive === false ? false : true,
          sortOrder: Math.max(0, Math.min(9999, Number(i.sortOrder ?? idx * 10) || 0)),
        })),
      })
    }

    const updated = await prisma.menu.findUnique({
      where: { key },
      include: { items: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] } },
    })

    return NextResponse.json({ ok: true, menu: updated })
  } catch {
    return NextResponse.json({ ok: false, error: "update_failed" }, { status: 500 })
  }
}
