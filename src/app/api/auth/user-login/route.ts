import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { otpStore } from "@/lib/otp-store";
import { findOrCreateUser, signUserToken, setUserCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, method, password, otp } = body;

    // Support legacy format: { email, password }
    const actualIdentifier = identifier || body.email;
    const actualMethod = method || "password";
    const actualPassword = password || body.password;

    if (!actualIdentifier) {
      return NextResponse.json({ error: "Email or phone number is required" }, { status: 400 });
    }

    // Detect if identifier is phone (10 digits) or email (contains @)
    const isPhone = /^\d{10}$/.test(actualIdentifier);
    const isEmail = actualIdentifier.includes("@");

    if (!isPhone && !isEmail) {
      return NextResponse.json({ error: "Please enter a valid email or 10-digit phone number" }, { status: 400 });
    }

    if (actualMethod === "otp") {
      // OTP-based login (phone only)
      if (!isPhone) {
        return NextResponse.json({ error: "OTP login is only available with phone number" }, { status: 400 });
      }

      if (!otp) {
        return NextResponse.json({ error: "OTP is required" }, { status: 400 });
      }

      // Validate OTP
      const stored = otpStore.get(actualIdentifier);
      if (!stored) {
        return NextResponse.json({ error: "OTP not found. Please request a new one." }, { status: 400 });
      }
      if (Date.now() > stored.expires) {
        otpStore.delete(actualIdentifier);
        return NextResponse.json({ error: "OTP expired. Please request a new one." }, { status: 400 });
      }
      if (stored.otp !== otp) {
        return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
      }
      otpStore.delete(actualIdentifier);

      // Find or create user
      const { user, isNewUser } = await findOrCreateUser(actualIdentifier);

      const token = signUserToken(user);
      const response = NextResponse.json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name, phone: user.phone },
        isNewUser,
      });
      return setUserCookie(response, token);

    } else {
      // Password-based login (email or phone)
      if (!actualPassword) {
        return NextResponse.json({ error: "Password is required" }, { status: 400 });
      }

      const user = isPhone
        ? await prisma.user.findUnique({ where: { phone: actualIdentifier } })
        : await prisma.user.findUnique({ where: { email: actualIdentifier } });

      if (!user) {
        return NextResponse.json({ error: "No account found. Please register or login with OTP." }, { status: 401 });
      }

      if (!user.password) {
        return NextResponse.json({
          error: "No password set on this account. Please login with OTP or set a password from your dashboard.",
          needsOtp: true,
        }, { status: 401 });
      }

      const isValid = await bcrypt.compare(actualPassword, user.password);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const token = signUserToken(user);
      const response = NextResponse.json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name, phone: user.phone },
        isNewUser: false,
      });
      return setUserCookie(response, token);
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
