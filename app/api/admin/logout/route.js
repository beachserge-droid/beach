import { NextResponse } from "next/server"

const cookieName = "admin_token"

const clearCookie = (response) => {
  response.cookies.set(cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
  return response
}

export async function GET(request) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url))
  return clearCookie(response)
}

export async function POST() {
  const response = NextResponse.json({ ok: true })
  return clearCookie(response)
}
