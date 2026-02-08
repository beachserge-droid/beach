import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET(_request, { params }) {
  try {
    const resolvedParams = await params
    const key = resolvedParams?.key ? String(resolvedParams.key) : ""
    if (!key) {
      return NextResponse.json({ ok: false, error: "key_required" }, { status: 400 })
    }

    const menu = await prisma.menu.findUnique({
      where: { key },
      include: {
        items: {
          where: { isActive: true },
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        },
      },
    })

    return NextResponse.json({ ok: true, menu })
  } catch {
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 })
  }
}
