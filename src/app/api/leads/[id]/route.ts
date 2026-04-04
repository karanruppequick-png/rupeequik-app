import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const updateData: Record<string, unknown> = {};

  if (body.name !== undefined) updateData.name = body.name;
  if (body.email !== undefined) updateData.email = body.email;
  if (body.category !== undefined) updateData.category = body.category;
  if (body.income !== undefined) updateData.income = body.income;
  if (body.loanAmount !== undefined) updateData.loanAmount = body.loanAmount;
  if (body.offerId !== undefined) updateData.offerId = body.offerId;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.pan !== undefined) updateData.pan = body.pan;
  if (body.gender !== undefined) updateData.gender = body.gender;
  if (body.source !== undefined) updateData.source = body.source;

  const updated = await prisma.lead.update({
    where: { id },
    data: updateData,
  });

  // If an offer was selected, return its redirect URL
  let redirectUrl = null;
  if (body.offerId) {
    const offer = await prisma.offer.findUnique({ where: { id: body.offerId } });
    if (offer) {
      const params = new URLSearchParams({
        name: updated.name || "",
        phone: updated.phone,
        ...(updated.email && { email: updated.email }),
      });
      redirectUrl = `${offer.redirectUrl}?${params.toString()}`;
    }
  }

  return NextResponse.json({ lead: updated, redirectUrl });
}
