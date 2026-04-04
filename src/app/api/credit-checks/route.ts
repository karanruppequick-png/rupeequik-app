import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { pan: { contains: search } },
      { mobile: { contains: search } },
    ];
  }

  const [checks, total] = await Promise.all([
    prisma.creditCheck.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.creditCheck.count({ where }),
  ]);

  return NextResponse.json({
    checks,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
