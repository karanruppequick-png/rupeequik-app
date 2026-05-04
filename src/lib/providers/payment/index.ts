import Razorpay from "razorpay";
import type { PaymentStatus } from "./types";

export interface CreatePaymentInput {
  amount: number; // in paise
  currency?: string;
  leadId?: string;
  userId?: string;
  metadata?: Record<string, string>;
  receipt?: string;
}

export interface PaymentProvider {
  createOrder(input: CreatePaymentInput): Promise<{
    orderId: string;
    amount: number;
    currency: string;
    status: string;
  }>;
  verifyPayment(orderId: string, paymentId: string, signature: string): boolean;
}

function getRazorpay(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export class RazorpayProvider implements PaymentProvider {
  createOrder(input: CreatePaymentInput): Promise<{
    orderId: string;
    amount: number;
    currency: string;
    status: string;
  }> {
    return new Promise((resolve, reject) => {
      const rzp = getRazorpay();

      rzp.orders.create(
        {
          amount: input.amount,
          currency: input.currency ?? "INR",
          receipt: input.receipt ?? `rcpt_${Date.now()}`,
          notes: {
            leadId: input.leadId ?? "",
            userId: input.userId ?? "",
            ...input.metadata,
          },
        },
        (err, order) => {
          if (err) {
            reject(new Error(err.error?.description ?? err.error?.reason ?? "Razorpay order creation failed"));
            return;
          }
          resolve({
            orderId: order.id,
            amount: Number(order.amount),
            currency: order.currency,
            status: order.status,
          });
        }
      );
    });
  }

  verifyPayment(orderId: string, paymentId: string, signature: string): boolean {
    const crypto = require("crypto");
    const keySecret = process.env.RAZORPAY_KEY_SECRET!;
    const payload = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(payload)
      .digest("hex");
    return expectedSignature === signature;
  }
}

let _instance: PaymentProvider | null = null;

export function getPaymentProvider(): PaymentProvider {
  if (!_instance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    if (!keyId) {
      throw new Error("RAZORPAY_KEY_ID not set — payments disabled");
    }
    _instance = new RazorpayProvider();
  }
  return _instance;
}

export type { PaymentStatus };