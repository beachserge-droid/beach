import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET() {
  const sliders = await prisma.slider.findMany({
    orderBy: { key: "asc" },
    include: { _count: { select: { slides: true } } },
  })
  return NextResponse.json({ ok: true, sliders })
}
