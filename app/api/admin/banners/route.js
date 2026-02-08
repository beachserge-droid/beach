import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET() {
  const groups = await prisma.bannerGroup.findMany({
    orderBy: { key: "asc" },
    include: { _count: { select: { banners: true } } },
  })
  return NextResponse.json({ ok: true, groups })
}
