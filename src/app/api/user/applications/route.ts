import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user's leads (loan applications)
    const leads = await prisma.lead.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        category: true,
        income: true,
        loanAmount: true,
        status: true,
        source: true,
        createdAt: true,
        offer: {
          select: {
            id: true,
            title: true,
            dsaName: true,
            category: true,
          },
        },
      },
    });

    // Fetch user's credit checks
    const creditChecks = await prisma.creditCheck.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        pan: true,
        name: true,
        score: true,
        source: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      leads,
      creditChecks,
    });
  } catch (error) {
    console.error("Applications fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
