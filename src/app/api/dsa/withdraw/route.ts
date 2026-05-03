import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const dsaId = request.headers.get("X-Dsa-Id");
    if (!dsaId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount } = await request.json();

    if (!amount || amount < 500) {
      return NextResponse.json({ error: "Minimum withdrawal amount is Rs. 500" }, { status: 400 });
    }

    const amountPaise = amount * 100;

    const dsa = await prisma.dsaPartner.findUnique({
      where: { id: dsaId },
      select: { walletBalance: true },
    });

    if (!dsa) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    if (dsa.walletBalance < amountPaise) {
      return NextResponse.json({ error: "Insufficient wallet balance" }, { status: 400 });
    }

    await prisma.withdrawalRequest.create({
      data: {
        dsaPartnerId: dsaId,
        amount: amountPaise,
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Withdrawal request submitted. Processing in 3-5 business days.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}