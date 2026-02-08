import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET(_request, { params }) {
  try {
    const resolvedParams = await params
    const id = Number(resolvedParams?.id)
    if (!id || Number.isNaN(id)) return NextResponse.json({ ok: false, error: "id_required" }, { status: 400 })

    const color = await prisma.color.findUnique({ where: { id } })
    if (!color) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 })

    return NextResponse.json({ ok: true, color })
  } catch {
    return NextResponse.json({ ok: false, error: "get_failed" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params
    const id = Number(resolvedParams?.id)
    if (!id || Number.isNaN(id)) return NextResponse.json({ ok: false, error: "id_required" }, { status: 400 })

    const body = await request.json().catch(() => ({}))

    const name = body.name != null ? String(body.name).trim() : ""
    const slug = body.slug != null ? String(body.slug).trim() : ""
    if (!name || !slug) return NextResponse.json({ ok: false, error: "name_slug_required" }, { status: 400 })

    const hex = body.hex != null ? String(body.hex).trim() : ""
    const sortOrder = body.sortOrder != null ? Number(body.sortOrder) : 0
    const isActive = body.isActive === false ? false : true

    const color = await prisma.color.update({
      where: { id },
      data: {
        name,
        slug,
        hex: hex || null,
        sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
        isActive,
      },
    })

    return NextResponse.json({ ok: true, color })
  } catch {
    return NextResponse.json({ ok: false, error: "update_failed" }, { status: 500 })
  }
}

export async function DELETE(_request, { params }) {
  try {
    const resolvedParams = await params
    const id = Number(resolvedParams?.id)
    if (!id || Number.isNaN(id)) return NextResponse.json({ ok: false, error: "id_required" }, { status: 400 })

    await prisma.color.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: "delete_failed" }, { status: 500 })
  }
}
