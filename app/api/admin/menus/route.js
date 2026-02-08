import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET() {
  const menus = await prisma.menu.findMany({
    orderBy: { key: "asc" },
    include: { _count: { select: { items: true } } },
  })
  return NextResponse.json({ ok: true, menus })
}
