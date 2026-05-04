import { NextRequest, NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/providers/payment";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, leadId, metadata } = body;

    if (!amount || typeof amount !== "number" || amount < 100) {
      return NextResponse.json(
        { error: "Amount must be a number >= 100 (paise)" },
        { status: 400 }
      );
    }

    const authUser = await getAuthUser(request);

    const payment = await prisma.payment.create({
      data: {
        amount,
        status: "created",
        leadId: leadId ?? null,
        userId: authUser?.id ?? null,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    const provider = getPaymentProvider();
    const order = await provider.createOrder({
      amount,
      leadId,
      userId: authUser?.id ?? undefined,
      metadata,
      receipt: `rcpt_${payment.id.slice(0, 20)}`,
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: { razorpayOrderId: order.orderId },
    });

    return NextResponse.json({
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment.id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Payment creation failed";
    console.error("[payments/create-order]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}