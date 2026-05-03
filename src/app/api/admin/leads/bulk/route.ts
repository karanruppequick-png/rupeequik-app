import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = [
  "otp-verified",
  "details-filled",
  "offer-selected",
  "redirected",
  "credit-checked",
  "converted",
];

export async function PATCH(request: NextRequest) {
  try {
    const staffId = request.headers.get("X-Staff-Id");
    if (!staffId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { leadIds, status } = await request.json();

    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json({ error: "leadIds array required" }, { status: 400 });
    }

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
    }

    // Update leads
    const updated = await prisma.lead.updateMany({
      where: { id: { in: leadIds } },
      data: { status },
    });

    // Create timeline events for each
    const events = leadIds.map((leadId: string) => ({
      leadId,
      event: "status_change",
      description: `Bulk status update to ${status}`,
      actorType: "staff",
      actorId: staffId,
    }));

    await prisma.leadTimelineEvent.createMany({ data: events });

    return NextResponse.json({ success: true, updated: updated.count });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}