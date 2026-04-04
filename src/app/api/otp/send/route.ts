import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || phone.length !== 10) {
      return NextResponse.json({ error: "Valid 10-digit phone number required" }, { status: 400 });
    }

    // Format phone number to E.164 (Assuming +91 for India as default for this platform)
    const formattedPhone = `+91${phone}`;

    if (client && verifyServiceSid && verifyServiceSid !== "VAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX") {
      try {
        await client.verify.v2.services(verifyServiceSid).verifications.create({
          to: formattedPhone,
          channel: "sms",
        });
        console.log(`Twilio Verify: Sent OTP request to ${formattedPhone}`);
      } catch (smsError: any) {
        console.error("Twilio Verify Error:", smsError);
        return NextResponse.json({ error: "Failed to send verification SMS." }, { status: 500 });
      }
    } else {
      // DEV MODE fallback
      console.log(`[DEV MODE] Twilio Verify SID not configured. SMS not sent to ${formattedPhone}`);
    }

    return NextResponse.json({
      success: true,
      message: "Verification OTP sent successfully",
    });
  } catch (error) {
    console.error("OTP API Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
