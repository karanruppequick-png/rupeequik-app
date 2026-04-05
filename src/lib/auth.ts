import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "fallback-secret";

export interface JwtPayload {
  id: string;
  phone: string;
  name: string;
  role: string;
}

export function signUserToken(user: { id: string; phone: string; name: string; email?: string | null }) {
  return jwt.sign(
    { id: user.id, phone: user.phone, name: user.name, email: user.email || null, role: "user" },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function setUserCookie(response: NextResponse, token: string) {
  response.cookies.set("user-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
  return response;
}

export async function getAuthUser(request: NextRequest) {
  const token = request.cookies.get("user-token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, phone: true, password: true, createdAt: true },
    });
    return user;
  } catch {
    return null;
  }
}

export async function findOrCreateUser(phone: string, name?: string, email?: string) {
  const user = await prisma.user.upsert({
    where: { phone },
    create: {
      phone,
      name: name || "User",
      email: email || null,
    },
    update: {
      // Update name/email only if currently empty
      ...(name ? { name } : {}),
    },
  });

  const isNewUser = user.createdAt.getTime() > Date.now() - 5000; // created within last 5 seconds
  return { user, isNewUser };
}
