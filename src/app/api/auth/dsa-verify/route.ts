import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyOTP } from "@/lib/services/otp-service";

const JWT_SECRET =
  (process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "missing-jwt-secret") as string;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, code } = body;

    if (!phone || !/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: "Phone must be exactly 10 digits" },
        { status: 400 }
      );
    }

    if (!code || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { success: false, error: "OTP must be 6 digits" },
        { status: 400 }
      );
    }

    const result = await verifyOTP(phone, code, "dsa");

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }

    const partner = await prisma.dsaPartner.findUnique({
      where: { phone },
    });

    if (!partner) {
      return NextResponse.json(
        { success: false, error: "DSA account not found" },
        { status: 404 }
      );
    }

    const token = jwt.sign(
      {
        id: partner.id,
        dsaId: partner.id,
        partnerCode: partner.partnerCode,
        role: "dsa",
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      success: true,
      data: {
        partnerCode: partner.partnerCode,
        name: partner.name,
        tier: partner.tier,
      },
    });

    response.cookies.set("dsa-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[dsa-verify] Error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
