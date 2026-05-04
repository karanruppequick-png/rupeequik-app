import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = (process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "missing-jwt-secret") as string;

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token required" }, { status: 400 });
    }

    const payload = jwt.verify(refreshToken, JWT_SECRET) as {
      id: string;
      phone: string;
      name: string;
      role: string;
      type?: string;
    };

    if (payload.type !== "refresh") {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
    }

    const token = jwt.sign(
      {
        id: payload.id,
        phone: payload.phone,
        name: payload.name,
        role: payload.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      success: true,
      token,
      expiresIn: 604800,
    });
  } catch {
    return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 });
  }
}