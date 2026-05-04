import { NextRequest, NextResponse } from "next/server";
import { verifyOTP } from "@/lib/services/otp-service";
import { prisma } from "@/lib/prisma";
import { findOrCreateUser, signUserToken, setUserCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { phone, otp, source } = await request.json();

    if (!phone || !otp || otp.length !== 6) {
      return NextResponse.json(
        { error: "Phone and 6-digit OTP are required" },
        { status: 400 }
      );
    }

    const purpose = source ?? "login";
    const result = await verifyOTP(phone, otp, purpose);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Create or get user account after OTP verified
    const { user, isNewUser } = await findOrCreateUser(phone);

    // Link any existing leads to this user
    await prisma.lead.updateMany({
      where: { phone, userId: null },
      data: { userId: user.id },
    });

    // Create a new lead for this verification
    const lead = await prisma.lead.create({
      data: {
        phone,
        source: purpose,
        status: "otp-verified",
        userId: user.id,
      },
    });

    // Issue JWT and set cookie — user is now logged in
    const token = signUserToken(user);
    const response = NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      leadId: lead.id,
      userId: user.id,
      isNewUser,
    });

    return setUserCookie(response, token);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[otp/verify] Unhandled error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}