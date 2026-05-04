import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_ROLES = ["admin", "manager", "telecaller", "super_admin"];

export async function GET(request: NextRequest) {
  const staffId = request.headers.get("X-Staff-Id");
  if (!staffId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const staff = await prisma.staffMember.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: staff });
}

export async function POST(request: NextRequest) {
  const staffId = request.headers.get("X-Staff-Id");
  if (!staffId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, email, password, role } = body;

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  const validRoles = ["admin", "manager", "telecaller", "super_admin"];
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const existing = await prisma.staffMember.findFirst({
    where: { email },
  });
  if (existing) {
    return NextResponse.json({ error: "Email already exists" }, { status: 409 });
  }

  const newStaff = await prisma.staffMember.create({
    data: { name, email, password, role, isActive: true },
  });

  await prisma.auditLog.create({
    data: {
      actorType: "staff",
      actorId: staffId,
      action: "staff.create",
      resource: "StaffMember",
      resourceId: newStaff.id,
      details: JSON.stringify({ name, email, role }),
      ipAddress: request.headers.get("x-forwarded-for") ?? "127.0.0.1",
    },
  });

  return NextResponse.json({ success: true, data: newStaff }, { status: 201 });
}