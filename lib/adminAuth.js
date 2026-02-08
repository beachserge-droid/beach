import { SignJWT, jwtVerify } from "jose"

const cookieName = "admin_token"

const getSecret = () => {
  const secret = process.env.ADMIN_JWT_SECRET
  if (!secret) throw new Error("Missing ADMIN_JWT_SECRET")
  return new TextEncoder().encode(secret)
}

export const getAdminCookieName = () => cookieName

export const signAdminToken = async ({ id, email }) => {
  const secret = getSecret()
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(id))
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)
}

export const verifyAdminToken = async (token) => {
  const secret = getSecret()
  const { payload } = await jwtVerify(token, secret)
  return payload
}
