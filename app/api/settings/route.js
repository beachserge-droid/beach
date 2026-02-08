import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } })
    return NextResponse.json({ ok: true, settings })
  } catch {
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 })
  }
}
