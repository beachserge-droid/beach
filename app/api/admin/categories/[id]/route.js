import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET(_request, { params }) {
  const resolvedParams = await params
  const id = Number(resolvedParams?.id)
  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ ok: false, error: "id_required" }, { status: 400 })
  }

  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 })
  }

  return NextResponse.json({ ok: true, category })
}

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params
    const id = Number(resolvedParams?.id)
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ ok: false, error: "id_required" }, { status: 400 })
    }

    const body = await request.json().catch(() => ({}))

    const name = body.name != null ? String(body.name).trim() : ""
    const slug = body.slug != null ? String(body.slug).trim() : ""

    if (!name || !slug) {
      return NextResponse.json({ ok: false, error: "name_slug_required" }, { status: 400 })
    }

    const parentId = body.parentId ? Number(body.parentId) : null
    const sortOrder = body.sortOrder != null ? Number(body.sortOrder) : 0

    const iconImage = body.iconImage ? String(body.iconImage) : null

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        parentId: parentId && !Number.isNaN(parentId) ? parentId : null,
        sortOrder: !Number.isNaN(sortOrder) ? sortOrder : 0,
        iconImage,
      },
    })

    return NextResponse.json({ ok: true, category })
  } catch {
    return NextResponse.json({ ok: false, error: "update_failed" }, { status: 500 })
  }
}

export async function DELETE(_request, { params }) {
  try {
    const resolvedParams = await params
    const id = Number(resolvedParams?.id)
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ ok: false, error: "id_required" }, { status: 400 })
    }

    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: "delete_failed" }, { status: 500 })
  }
}
