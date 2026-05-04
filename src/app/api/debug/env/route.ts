import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "missing-jwt-secret";
  return NextResponse.json({
    nexauth: process.env.NEXTAUTH_SECRET ? "SET" : "NOT SET",
    jwt: process.env.JWT_SECRET ? "SET" : "NOT SET",
    fallback: secret.slice(0, 10) + "...",
  });
}