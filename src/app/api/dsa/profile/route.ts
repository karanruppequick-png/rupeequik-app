import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const dsaId = request.headers.get("X-Dsa-Id");
    if (!dsaId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dsa = await prisma.dsaPartner.findUnique({
      where: { id: dsaId },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        businessName: true,
        partnerCode: true,
        isVerified: true,
        isActive: true,
        tier: true,
        totalLeads: true,
        walletBalance: true,
        totalEarnings: true,
        createdAt: true,
      },
    });

    if (!dsa) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: dsa });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}