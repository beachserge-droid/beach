import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { sanitizeInput, validateEmail } from "@/lib/security"

export const runtime = "nodejs"

const parseBody = async (request) => {
  const contentType = request.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    const json = await request.json()
    return {
      email: sanitizeInput(json.email, 254),
      password: sanitizeInput(json.password, 500),
      setupKey: sanitizeInput(json.setupKey, 500),
    }
  }

  const form = await request.formData()
  return {
    email: sanitizeInput(form.get("email"), 254),
    password: sanitizeInput(form.get("password"), 500),
    setupKey: sanitizeInput(form.get("setupKey"), 500),
  }
}

export async function GET() {
  try {
    const count = await prisma.adminUser.count()
    return NextResponse.json({ ok: true, hasAdmin: count > 0 })
  } catch (err) {
    return NextResponse.json({ ok: false, hasAdmin: false, error: "db_error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    console.log("Bootstrap POST started")
    const hasAdmin = (await prisma.adminUser.count()) > 0
    if (hasAdmin) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    const requiredKey = process.env.ADMIN_SETUP_KEY
    console.log("Required key:", requiredKey)
    
    const formData = await request.formData()
    const email = formData.get("email")
    const password = formData.get("password")
    const setupKey = formData.get("setupKey")
    
    console.log("Parsed body:", { email, hasPassword: !!password, setupKey })

    const validEmail = validateEmail(email)
    if (!validEmail) {
      return NextResponse.redirect(new URL("/admin/login?setupError=1", request.url))
    }

    if (requiredKey && String(setupKey || "") !== requiredKey) {
      return NextResponse.redirect(new URL("/admin/login?setupError=1", request.url))
    }

    if (!password || String(password).length < 8) {
      return NextResponse.redirect(new URL("/admin/login?setupError=1", request.url))
    }

    const passwordHash = await bcrypt.hash(String(password), 10)

    await prisma.adminUser.create({
      data: {
        email: validEmail,
        passwordHash,
      },
    })

    return NextResponse.redirect(new URL("/admin/login", request.url))
  } catch (error) {
    console.error("Bootstrap error:", error)
    return NextResponse.redirect(new URL("/admin/login?setupError=1", request.url))
  }
}
