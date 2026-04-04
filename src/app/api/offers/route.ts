import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const where: Record<string, unknown> = { status: "active" };
  if (category) where.category = category;

  const offers = await prisma.offer.findMany({
    where,
    orderBy: { priority: "asc" },
  });

  return NextResponse.json(offers);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const offer = await prisma.offer.create({ data: body });

  return NextResponse.json(offer, { status: 201 });
}
