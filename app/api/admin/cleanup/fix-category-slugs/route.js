import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

const slugify = (value) =>
  (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")

const ensureUniqueSlug = async (tx, baseSlug, ignoreId) => {
  const cleanBase = String(baseSlug || "").trim() || "category"
  let candidate = cleanBase
  let n = 2

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const exists = await tx.category.findUnique({ where: { slug: candidate } })
    if (!exists || exists.id === ignoreId) return candidate
    candidate = `${cleanBase}-${n}`
    n += 1
    if (n > 50) return `${cleanBase}-${Date.now()}`
  }
}

export async function POST() {
  try {
    const numericSlug = /^[0-9]+$/

    const updated = await prisma.$transaction(async (tx) => {
      const targets = await tx.category.findMany({
        select: { id: true, name: true, slug: true },
        take: 2000,
      })

      const toFix = targets.filter((c) => numericSlug.test(String(c.slug || "")))
      let fixed = 0

      for (const c of toFix) {
        const base = slugify(c.name)
        if (!base) continue
        const nextSlug = await ensureUniqueSlug(tx, base, c.id)
        if (nextSlug && nextSlug !== c.slug) {
          await tx.category.update({ where: { id: c.id }, data: { slug: nextSlug } })
          fixed += 1
        }
      }

      return { scanned: targets.length, numeric: toFix.length, fixed }
    })

    return NextResponse.json({ ok: true, ...updated })
  } catch (e) {
    const message = e && typeof e === "object" && "message" in e ? String(e.message) : "fix_failed"
    const stack = e && typeof e === "object" && "stack" in e ? String(e.stack) : null
    return NextResponse.json(
      { ok: false, error: message, stack: process.env.NODE_ENV !== "production" ? stack : null },
      { status: 500 }
    )
  }
}
