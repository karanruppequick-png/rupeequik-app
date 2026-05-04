import { NextRequest, NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/providers/payment";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentId } = body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: "razorpayOrderId, razorpayPaymentId, razorpaySignature required" },
        { status: 400 }
      );
    }

    const provider = getPaymentProvider();
    const isValid = provider.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!isValid) {
      // Mark payment as failed
      if (paymentId) {
        await prisma.payment.update({
          where: { id: paymentId },
          data: { status: "failed", razorpayPaymentId, razorpaySignature },
        });
      }
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Update payment as completed
    const updateData: Record<string, unknown> = {
      status: "completed",
      razorpayPaymentId,
      razorpaySignature,
      completedAt: new Date(),
    };

    if (paymentId) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: updateData,
      });
    } else if (razorpayOrderId) {
      await prisma.payment.updateMany({
        where: { razorpayOrderId },
        data: updateData,
      });
    }

    return NextResponse.json({ verified: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Verification failed";
    console.error("[payments/verify]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}