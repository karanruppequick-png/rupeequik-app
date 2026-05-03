import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const dsaId = request.headers.get("X-Dsa-Id");
    if (!dsaId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20", 10));
    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where: { dsaPartnerId: dsaId },
        select: {
          id: true,
          phone: true,
          name: true,
          category: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.lead.count({ where: { dsaPartnerId: dsaId } }),
    ]);

    // Mask phone — show only last 4
    const masked = leads.map((l) => ({
      ...l,
      phone: `*******${l.phone.slice(-4)}`,
    }));

    return NextResponse.json({
      success: true,
      data: masked,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}