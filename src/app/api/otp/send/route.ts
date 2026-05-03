import { NextRequest, NextResponse } from "next/server";
import { sendOTP } from "@/lib/services/otp-service";

export async function POST(request: NextRequest) {
  try {
    const { phone, purpose } = await request.json();

    if (!phone || phone.length !== 10) {
      return NextResponse.json(
        { error: "Valid 10-digit phone number required" },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    const result = await sendOTP(phone, purpose ?? "loan-apply", ip);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
          ...(result.retryAfterSeconds
            ? { retryAfterSeconds: result.retryAfterSeconds }
            : {}),
        },
        { status: 429 }
      );
    }

    return NextResponse.json({
      success: true,
      ...(result.devOtp ? { devOtp: result.devOtp } : {}),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[otp/send] Unhandled error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}