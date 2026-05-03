import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOTP } from "@/lib/services/otp-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone || !/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: "Phone must be exactly 10 digits" },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    const partner = await prisma.dsaPartner.findUnique({
      where: { phone },
    });

    if (!partner) {
      return NextResponse.json(
        { success: false, error: "No active DSA account found for this number" },
        { status: 401 }
      );
    }

    if (!partner.isActive) {
      return NextResponse.json(
        { success: false, error: "No active DSA account found for this number" },
        { status: 401 }
      );
    }

    if (!partner.isVerified) {
      return NextResponse.json(
        { success: false, error: "Your account is pending verification. We will notify you once approved." },
        { status: 403 }
      );
    }

    const result = await sendOTP(phone, "dsa", ip);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 429 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent to your registered number",
      ...(result.devOtp ? { devOtp: result.devOtp } : {}),
    });
  } catch (err) {
    console.error("[dsa-login] Error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
