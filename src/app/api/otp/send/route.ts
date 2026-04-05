import { NextRequest, NextResponse } from "next/server";
import { otpStore } from "@/lib/otp-store";

export async function POST(request: NextRequest) {
  const { phone } = await request.json();

  if (!phone || phone.length !== 10) {
    return NextResponse.json({ error: "Valid 10-digit phone number required" }, { status: 400 });
  }

  // Generate 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore.set(phone, { otp, expires: Date.now() + 5 * 60 * 1000 });

  // In production, send via SMS gateway (MSG91, Twilio, etc.)
  console.log(`OTP for ${phone}: ${otp}`);

  return NextResponse.json({
    success: true,
    message: "OTP sent successfully",
    // Remove in production - only for development
    devOtp: process.env.NODE_ENV === "development" ? otp : undefined,
  });
}
