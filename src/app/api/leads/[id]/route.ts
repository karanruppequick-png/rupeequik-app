import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

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
  if (body.creditScore !== undefined) updateData.creditScore = body.creditScore;
  if (body.creditScoreCategory !== undefined) updateData.creditScoreCategory = body.creditScoreCategory;
  if (body.creditReportData !== undefined) updateData.creditReportData = body.creditReportData;

  // Link to authenticated user if available and not already linked
  if (!lead.userId) {
    const authUser = await getAuthUser(request);
    if (authUser) {
      updateData.userId = authUser.id;
    }
  }

  const updated = await prisma.lead.update({
    where: { id },
    data: updateData,
  });

  // Update User profile with name/email if they're missing
  if (updated.userId && (body.name || body.email)) {
    const linkedUser = await prisma.user.findUnique({ where: { id: updated.userId } });
    if (linkedUser) {
      const userUpdate: Record<string, string> = {};
      if (body.name && (!linkedUser.name || linkedUser.name === "User")) {
        userUpdate.name = body.name;
      }
      if (body.email && !linkedUser.email) {
        userUpdate.email = body.email;
      }
      if (Object.keys(userUpdate).length > 0) {
        await prisma.user.update({ where: { id: updated.userId }, data: userUpdate });
      }
    }
  }

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
