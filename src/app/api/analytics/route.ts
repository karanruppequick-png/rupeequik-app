import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [totalLeads, totalOffers, leadsByCategory, recentLeads] = await Promise.all([
    prisma.lead.count(),
    prisma.offer.count({ where: { status: "active" } }),
    prisma.lead.groupBy({
      by: ["category"],
      _count: { id: true },
    }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { offer: { select: { title: true } } },
    }),
  ]);

  const categoryStats = leadsByCategory.map((item) => ({
    category: item.category,
    count: item._count.id,
  }));

  return NextResponse.json({
    totalLeads,
    totalOffers,
    categoryStats,
    recentLeads,
  });
}
