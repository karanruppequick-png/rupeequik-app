import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signUserToken, setUserCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, businessName } = await request.json();

    if (!phone || phone.length !== 10) {
      return NextResponse.json({ error: "Valid 10-digit phone number required" }, { status: 400 });
    }

    const existing = await prisma.dsaPartner.findUnique({ where: { phone } });
    if (existing) {
      return NextResponse.json({ error: "Phone number already registered as DSA partner" }, { status: 409 });
    }

    // Generate partner code: DSA + 6 random uppercase alphanumeric
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const codePart = Array.from({ length: 6 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
    const partnerCode = `DSA${codePart}`;

    const dsa = await prisma.dsaPartner.create({
      data: {
        name: name || "DSA Partner",
        phone,
        email: email || null,
        businessName: businessName || null,
        partnerCode,
        isVerified: false,
        isActive: false,
      },
    });

    return NextResponse.json({ success: true, partnerCode: dsa.partnerCode });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}