import { OTPProvider, OtpResult } from "./types";

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  verifyServiceSid: string;
}

export class TwilioProvider implements OTPProvider {
  private readonly config: TwilioConfig;

  constructor(config: TwilioConfig) {
    this.config = config;
  }

  async sendOTP(
    phone: string,
    _otp: string,
    _templateMessage: string
  ): Promise<OtpResult> {
    console.log("[Twilio] Sending OTP to", phone.slice(-4).padStart(10, "*"));

    try {
      const credentials = Buffer.from(
        `${this.config.accountSid}:${this.config.authToken}`
      ).toString("base64");

      const url = `https://verify.twilio.com/v2/Services/${this.config.verifyServiceSid}/Verifications`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: `+91${phone}`,
          Channel: "sms",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `Twilio HTTP ${response.status}: ${errorText}`,
        };
      }

      const data = (await response.json()) as { sid?: string; status?: string; message?: string };

      if (data.status === "pending" || data.sid) {
        return {
          success: true,
          messageId: data.sid ?? "sent",
        };
      }

      return {
        success: false,
        error: data.message ?? "Twilio verification failed",
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown network error";
      return { success: false, error: message };
    }
  }
}