import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    const key = `contact_submission_${Date.now()}`;
    const value = JSON.stringify({
      name,
      email,
      phone,
      message,
      submittedAt: new Date().toISOString(),
    });

    await prisma.setting.create({
      data: { key, value },
    });

    return NextResponse.json({ success: true, message: "Thank you. We will get back to you within 24 hours." });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}