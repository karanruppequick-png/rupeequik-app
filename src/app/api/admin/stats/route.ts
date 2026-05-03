import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const staffId = request.headers.get("X-Staff-Id");
    if (!staffId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [totalLeads, leadsToday, totalCreditChecks, creditChecksToday, conversionCount, recentLeads] =
      await Promise.all([
        prisma.lead.count(),
        prisma.lead.count({ where: { createdAt: { gte: startOfToday } } }),
        prisma.creditCheck.count(),
        prisma.creditCheck.count({ where: { createdAt: { gte: startOfToday } } }),
        prisma.lead.count({ where: { status: "converted" } }),
        prisma.lead.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            phone: true,
            category: true,
            status: true,
            createdAt: true,
          },
        }),
      ]);

    const masked = recentLeads.map((l) => ({
      ...l,
      phone: `*******${l.phone.slice(-4)}`,
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalLeads,
        leadsToday,
        totalCreditChecks,
        creditChecksToday,
        conversionCount,
        recentLeads: masked,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}