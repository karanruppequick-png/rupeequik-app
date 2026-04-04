import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const adminCount = await prisma.admin.count();
    return NextResponse.json({ 
      status: "success", 
      message: "Database connection successful", 
      adminCount 
    });
  } catch (error: any) {
    console.error("Database Debug Error:", error);
    return NextResponse.json({ 
      status: "error", 
      message: error.message,
      code: error.code,
      meta: error.meta
    }, { status: 500 });
  }
}
