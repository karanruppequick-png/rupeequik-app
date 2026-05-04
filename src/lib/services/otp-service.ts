import { randomInt } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getOTPProvider, getFallbackOTPProvider } from "@/lib/providers/otp";

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS_PER_OTP = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 60 minutes
const RATE_LIMIT_MAX = 5;

export function generateOTP(): string {
  return randomInt(100000, 999999).toString();
}

interface SendOTPResult {
  success: boolean;
  error?: string;
  retryAfterSeconds?: number;
  devOtp?: string;
}

export async function sendOTP(
  phone: string,
  purpose: string,
  ipAddress: string
): Promise<SendOTPResult> {
  // a. Validate phone
  if (!/^\d{10}$/.test(phone)) {
    return { success: false, error: "Phone must be exactly 10 digits" };
  }

  // b. Dev mode: skip SMS, return OTP directly
  if (process.env.NODE_ENV === "development") {
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);
    await prisma.otpAttempt.create({
      data: {
        phone,
        code: hashedOtp,
        purpose,
        provider: "mock",
        status: "pending",
        attempts: 0,
        ipAddress: ipAddress ?? null,
        expiresAt: new Date(Date.now() + OTP_TTL_MS),
      },
    });
    return { success: true, devOtp: otp };
  }

  // b. Rate limit check
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
  const recentCount = await prisma.otpAttempt.count({
    where: {
      phone,
      purpose,
      status: { not: "expired" },
      createdAt: { gte: windowStart },
    },
  });

  if (recentCount >= RATE_LIMIT_MAX) {
    const oldest = await prisma.otpAttempt.findFirst({
      where: { phone, purpose, status: { not: "expired" }, createdAt: { gte: windowStart } },
      orderBy: { createdAt: "asc" },
    });

    if (oldest) {
      const unlockAt = new Date(oldest.createdAt.getTime() + RATE_LIMIT_WINDOW_MS);
      const retryAfterSeconds = Math.max(0, Math.ceil((unlockAt.getTime() - Date.now()) / 1000));
      return { success: false, error: "Too many OTP requests. Please try again later.", retryAfterSeconds };
    }

    return { success: false, error: "Too many OTP requests. Please try again later." };
  }

  // c. Generate OTP
  const otp = generateOTP();

  // d. Hash OTP
  const hashedOtp = await bcrypt.hash(otp, 10);

  // e. Create OtpAttempt record
  const attempt = await prisma.otpAttempt.create({
    data: {
      phone,
      code: hashedOtp,
      purpose,
      provider: "mcarbon",
      status: "pending",
      attempts: 0,
      ipAddress: ipAddress ?? null,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });

  // f. Build SMS template
  const templateMessage = `Your RupeeQuik OTP is ${otp}. Valid for 5 minutes. Do not share. RPQWIK`;

  // g. Send via primary provider
  let providerName = "mcarbon";
  let provider = getOTPProvider();

  try {
    const result = await provider.sendOTP(phone, otp, templateMessage);

    if (!result.success) {
      console.log(`[otp-service] mCarbon failed for ${phone.slice(-4)}, trying Twilio fallback`);

      try {
        provider = getFallbackOTPProvider();
        providerName = "twilio";
        const fallbackResult = await provider.sendOTP(phone, otp, templateMessage);

        if (!fallbackResult.success) {
          await prisma.otpAttempt.update({
            where: { id: attempt.id },
            data: { status: "expired" },
          });
          return { success: false, error: fallbackResult.error ?? "SMS delivery failed" };
        }
      } catch {
        await prisma.otpAttempt.update({
          where: { id: attempt.id },
          data: { status: "expired" },
        });
        return { success: false, error: "SMS delivery failed. Please try again." };
      }
    }

    // Update provider field if fallback was used
    if (providerName === "twilio") {
      await prisma.otpAttempt.update({
        where: { id: attempt.id },
        data: { provider: "twilio" },
      });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[otp-service] OTP send error:", message);

    await prisma.otpAttempt.update({
      where: { id: attempt.id },
      data: { status: "expired" },
    });
    return { success: false, error: "Failed to send OTP. Please try again." };
  }

  // i. Dev mode: expose OTP in response
  if (process.env.NODE_ENV === "development") {
    return { success: true, devOtp: otp };
  }

  // j. Production
  return { success: true };
}

interface VerifyOTPResult {
  success: boolean;
  error?: string;
}

export async function verifyOTP(
  phone: string,
  code: string,
  purpose: string
): Promise<VerifyOTPResult> {
  // a. Find most recent pending attempt
  const attempt = await prisma.otpAttempt.findFirst({
    where: { phone, purpose, status: "pending" },
    orderBy: { createdAt: "desc" },
  });

  if (!attempt) {
    return { success: false, error: "No OTP sent to this number" };
  }

  // c. Check expiry
  if (attempt.expiresAt < new Date()) {
    await prisma.otpAttempt.update({
      where: { id: attempt.id },
      data: { status: "expired" },
    });
    return { success: false, error: "OTP has expired. Please request a new one." };
  }

  // d. Check attempt count
  if (attempt.attempts >= MAX_ATTEMPTS_PER_OTP) {
    await prisma.otpAttempt.update({
      where: { id: attempt.id },
      data: { status: "expired" },
    });
    return { success: false, error: "Too many incorrect attempts." };
  }

  // e. Compare OTP
  const isValid = await bcrypt.compare(code, attempt.code);

  if (!isValid) {
    await prisma.otpAttempt.update({
      where: { id: attempt.id },
      data: { attempts: { increment: 1 } },
    });
    return { success: false, error: "Incorrect OTP." };
  }

  // g. Mark as verified
  await prisma.otpAttempt.update({
    where: { id: attempt.id },
    data: {
      status: "verified",
      verifiedAt: new Date(),
    },
  });

  return { success: true };
}