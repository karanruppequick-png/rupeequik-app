import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_ROLES = ["owner", "super_admin", "admin", "manager", "telecaller"];

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
  const { isActive, role } = body;

  if (role !== undefined) {
    const validRoles = ["owner", "super_admin", "admin", "manager", "telecaller"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
  }

  const current = await prisma.staffMember.findUnique({ where: { id } });
  if (!current) {
    return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
  }

  const updateData: Record<string, unknown> = {};
  if (isActive !== undefined) updateData.isActive = isActive;
  if (role !== undefined) updateData.role = role;

  const updated = await prisma.staffMember.update({
    where: { id },
    data: updateData,
  });

  await prisma.auditLog.create({
    data: {
      actorType: "staff",
      actorId: staffId,
      action: "staff.update",
      resource: "StaffMember",
      resourceId: id,
      details: JSON.stringify({
        before: { isActive: current.isActive, role: current.role },
        after: { isActive: updated.isActive, role: updated.role },
      }),
      ipAddress: request.headers.get("x-forwarded-for") ?? "127.0.0.1",
    },
  });

  return NextResponse.json({ success: true, data: updated });
}