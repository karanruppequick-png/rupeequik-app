import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { prisma } from "@/lib/prisma";

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function POST(request: NextRequest) {
  try {
    const { phone, otp, source } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: "Phone and OTP are required" }, { status: 400 });
    }

    // Format phone number to E.164
    const formattedPhone = `+91${phone}`;

    if (client && verifyServiceSid && verifyServiceSid !== "VAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX") {
      try {
        const check = await client.verify.v2.services(verifyServiceSid)
          .verificationChecks.create({ to: formattedPhone, code: otp });

        if (check.status !== "approved") {
          return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
        }
      } catch (verifyError: any) {
        console.error("Twilio Verify Check Error:", verifyError);
        return NextResponse.json({ error: "Verification service error." }, { status: 500 });
      }
    } else {
      // DEV MODE fallback - allow any 6-digit code if not configured
      console.log(`[DEV MODE] Skipping real Twilio Verify for ${formattedPhone}`);
      if (otp !== "123456") {
         return NextResponse.json({ error: "Invalid OTP (Dev Mode: use 123456)" }, { status: 400 });
      }
    }

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
  } catch (error) {
    console.error("Verify API Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
