import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

const cookieName = "admin_token"

const getSecret = () => {
  const secret = process.env.ADMIN_JWT_SECRET
  if (!secret) return null
  return new TextEncoder().encode(secret)
}

export async function middleware(request) {
  const { pathname, search } = request.nextUrl

  const isAdminPage = pathname.startsWith("/admin")
  const isAdminApi = pathname.startsWith("/api/admin")

  const isPublicAdminApi =
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/bootstrap" ||
    pathname === "/api/admin/logout"

  if (pathname === "/admin/login") return NextResponse.next()
  if (isAdminApi && isPublicAdminApi) return NextResponse.next()

  const secret = getSecret()
  if (!secret) {
    if (isAdminApi) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
    const url = new URL("/admin/login", request.url)
    url.searchParams.set("next", pathname + search)
    return NextResponse.redirect(url)
  }

  const token = request.cookies.get(cookieName)?.value
  if (!token) {
    if (isAdminApi) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
    const url = new URL("/admin/login", request.url)
    url.searchParams.set("next", pathname + search)
    return NextResponse.redirect(url)
  }

  try {
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    if (isAdminApi) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
    const url = new URL("/admin/login", request.url)
    url.searchParams.set("next", pathname + search)
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
