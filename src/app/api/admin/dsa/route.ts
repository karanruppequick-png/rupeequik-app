import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const staffId = request.headers.get("X-Staff-Id");
  if (!staffId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const partners = await prisma.dsaPartner.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: partners });
}
