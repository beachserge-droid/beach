import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { signAdminToken } from "@/lib/adminAuth"
import { isBlocked, recordAttempt, getClientIP, validateEmail, validateRedirect, sanitizeInput } from "@/lib/security"

const cookieName = "admin_token"

const parseBody = async (request) => {
  const contentType = request.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    const json = await request.json()
    return {
      email: sanitizeInput(json.email, 254),
      password: sanitizeInput(json.password, 500),
      next: sanitizeInput(json.next, 500),
    }
  }

  const form = await request.formData()
  return {
    email: sanitizeInput(form.get("email"), 254),
    password: sanitizeInput(form.get("password"), 500),
    next: sanitizeInput(form.get("next"), 500),
  }
}

export async function POST(request) {
  try {
    // Get client IP
    const clientIP = getClientIP(request)
    
    // Check if IP is blocked
    if (isBlocked(clientIP)) {
      return NextResponse.json(
        { ok: false, error: "too_many_requests", message: "Too many login attempts. Please try again later." },
        { status: 429, headers: { 'Retry-After': '3600' } }
      )
    }
    
    const { email, password, next } = await parseBody(request)
    
    // Validate email format
    const validEmail = validateEmail(email)
    if (!validEmail || !password) {
      recordAttempt(clientIP)
      return NextResponse.redirect(new URL("/admin/login?error=1", request.url))
    }

    const user = await prisma.adminUser.findUnique({ where: { email: validEmail } })
    if (!user) {
      recordAttempt(clientIP)
      return NextResponse.redirect(new URL("/admin/login?error=1", request.url))
    }

    const ok = await bcrypt.compare(String(password), user.passwordHash)
    if (!ok) {
      recordAttempt(clientIP)
      return NextResponse.redirect(new URL("/admin/login?error=1", request.url))
    }

    // Successful login - clear attempts
    const token = await signAdminToken({ id: user.id, email: user.email })
    
    // Validate redirect URL to prevent open redirect
    const redirectTo = validateRedirect(next) || "/admin"

    const response = NextResponse.redirect(new URL(redirectTo, request.url))
    response.cookies.set(cookieName, token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url))
  }
}
