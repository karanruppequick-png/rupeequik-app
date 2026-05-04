import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!RAZORPAY_WEBHOOK_SECRET) {
      console.error("[payments/webhook] RAZORPAY_WEBHOOK_SECRET not set");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    const expected = crypto
      .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (signature !== expected) {
      console.error("[payments/webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const { event: eventType, payload } = event;

    switch (eventType) {
      case "payment.captured": {
        const order = payload.order.entity;
        await prisma.payment.updateMany({
          where: { razorpayOrderId: order.id },
          data: {
            status: "completed",
            razorpayPaymentId: payload.payment.entity.id,
            completedAt: new Date(),
          },
        });
        break;
      }
      case "payment.failed": {
        const order = payload.order.entity;
        await prisma.payment.updateMany({
          where: { razorpayOrderId: order.id },
          data: {
            status: "failed",
            failureReason: payload.payment.entity.error_description ?? "Payment failed",
          },
        });
        break;
      }
      case "refund.created": {
        const refund = payload.refund.entity;
        await prisma.payment.updateMany({
          where: { razorpayPaymentId: refund.payment_id },
          data: { status: "refunded" },
        });
        break;
      }
      default:
        console.log("[payments/webhook] Unhandled event:", eventType);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook processing failed";
    console.error("[payments/webhook]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}