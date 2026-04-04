import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const source = searchParams.get("source");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (source) where.source = source;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { phone: { contains: search } },
      { email: { contains: search } },
      { pan: { contains: search } },
    ];
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: { offer: { select: { title: true, dsaName: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.lead.count({ where }),
  ]);

  return NextResponse.json({ leads, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const lead = await prisma.lead.create({
    data: {
      phone: body.phone,
      name: body.name || null,
      email: body.email || null,
      category: body.category || "general",
      source: body.source || "loan-apply",
      offerId: body.offerId || null,
      income: body.income || null,
      loanAmount: body.loanAmount || null,
      pan: body.pan || null,
      gender: body.gender || null,
      status: body.status || "otp-verified",
    },
  });

  let redirectUrl = null;
  if (body.offerId) {
    const offer = await prisma.offer.findUnique({ where: { id: body.offerId } });
    if (offer) {
      const params = new URLSearchParams({
        name: body.name || "",
        phone: body.phone,
        ...(body.email && { email: body.email }),
      });
      redirectUrl = `${offer.redirectUrl}?${params.toString()}`;
    }
  }

  return NextResponse.json({ lead, redirectUrl }, { status: 201 });
}
