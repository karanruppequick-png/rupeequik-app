import { NextRequest, NextResponse } from "next/server";
import { otpStore } from "@/lib/otp-store";
import { prisma } from "@/lib/prisma";
import { findOrCreateUser, signUserToken, setUserCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { phone, otp, source } = await request.json();

  if (!phone || !otp) {
    return NextResponse.json({ error: "Phone and OTP are required" }, { status: 400 });
  }

  const stored = otpStore.get(phone);

  if (!stored) {
    return NextResponse.json({ error: "OTP not found. Please request a new one." }, { status: 400 });
  }

  if (Date.now() > stored.expires) {
    otpStore.delete(phone);
    return NextResponse.json({ error: "OTP expired. Please request a new one." }, { status: 400 });
  }

  if (stored.otp !== otp) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  }

  otpStore.delete(phone);

  // Find or create user account on every OTP verification
  const { user, isNewUser } = await findOrCreateUser(phone);

  // Create a lead linked to the user
  const lead = await prisma.lead.create({
    data: {
      phone,
      source: source || "loan-apply",
      status: "otp-verified",
      userId: user.id,
    },
  });

  // Issue JWT and set cookie - user is now logged in
  const token = signUserToken(user);
  const response = NextResponse.json({
    success: true,
    message: "OTP verified successfully",
    leadId: lead.id,
    userId: user.id,
    isNewUser,
  });

  return setUserCookie(response, token);
}
