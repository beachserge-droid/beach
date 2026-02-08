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

    const slider = await prisma.slider.findUnique({
      where: { key },
      include: {
        slides: {
          where: { isActive: true },
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        },
      },
    })

    return NextResponse.json({ ok: true, slider })
  } catch {
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 })
  }
}
