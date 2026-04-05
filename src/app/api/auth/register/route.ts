import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signUserToken, setUserCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json();

    // Phone is the only required field
    if (!phone || phone.length !== 10) {
      return NextResponse.json({ error: "Valid 10-digit phone number is required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { phone } });

    if (existingUser) {
      // If user exists but has no password, allow profile completion
      if (!existingUser.password && password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const updated = await prisma.user.update({
          where: { phone },
          data: {
            ...(name ? { name } : {}),
            ...(email ? { email } : {}),
            password: hashedPassword,
          },
        });

        const token = signUserToken(updated);
        const response = NextResponse.json({
          success: true,
          user: { id: updated.id, email: updated.email, name: updated.name, phone: updated.phone },
          profileCompleted: true,
        });
        return setUserCookie(response, token);
      }

      return NextResponse.json({ error: "This phone number is already registered. Please login." }, { status: 409 });
    }

    // Check email uniqueness if provided
    if (email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) {
        return NextResponse.json({ error: "This email is already registered." }, { status: 409 });
      }
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const user = await prisma.user.create({
      data: {
        name: name || "User",
        email: email || null,
        phone,
        password: hashedPassword,
      },
    });

    // Link any existing leads and credit checks to this user
    await prisma.lead.updateMany({
      where: { phone, userId: null },
      data: { userId: user.id },
    });
    await prisma.creditCheck.updateMany({
      where: { mobile: phone, userId: null },
      data: { userId: user.id },
    });

    const token = signUserToken(user);
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, phone: user.phone },
    });
    return setUserCookie(response, token);
  } catch (error) {
    console.error("Registration Error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
