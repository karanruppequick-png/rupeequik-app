import { NextRequest, NextResponse } from "next/server";
import { otpStore } from "../send/route";
import { prisma } from "@/lib/prisma";

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

  // Create a lead on OTP verification
  const lead = await prisma.lead.create({
    data: {
      phone,
      source: source || "loan-apply",
      status: "otp-verified",
    },
  });

  return NextResponse.json({
    success: true,
    message: "OTP verified successfully",
    leadId: lead.id,
  });
}
