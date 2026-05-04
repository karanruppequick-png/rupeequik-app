import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const staffId = request.headers.get("X-Staff-Id");
  if (!staffId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { isActive, isVerified, tier } = body;

  if (tier !== undefined) {
    const validTiers = ["silver", "gold", "platinum", "diamond"];
    if (!validTiers.includes(tier)) {
      return NextResponse.json({ success: false, error: "Invalid tier" }, { status: 400 });
    }
  }

  const current = await prisma.dsaPartner.findUnique({ where: { id } });
  if (!current) {
    return NextResponse.json({ success: false, error: "DSA partner not found" }, { status: 404 });
  }

  const updateData: Record<string, unknown> = {};
  if (isActive !== undefined) updateData.isActive = isActive;
  if (isVerified !== undefined) {
    updateData.isVerified = isVerified;
    if (isVerified === true) updateData.isActive = true;
  }
  if (tier !== undefined) updateData.tier = tier;

  const updated = await prisma.dsaPartner.update({
    where: { id },
    data: updateData,
  });

  await prisma.auditLog.create({
    data: {
      actorType: "staff",
      actorId: staffId,
      action: "dsa.update",
      resource: "DsaPartner",
      resourceId: id,
      details: JSON.stringify({
        before: {
          isActive: current.isActive,
          isVerified: current.isVerified,
          tier: current.tier,
        },
        after: {
          isActive: updated.isActive,
          isVerified: updated.isVerified,
          tier: updated.tier,
        },
      }),
      ipAddress: request.headers.get("x-forwarded-for") ?? "127.0.0.1",
    },
  });

  return NextResponse.json({ success: true, data: updated });
}
