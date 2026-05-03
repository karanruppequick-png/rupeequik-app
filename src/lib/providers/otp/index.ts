import { OTPProvider } from "./types";
import { MCarbonProvider } from "./mcarbon";
import { TwilioProvider } from "./twilio";

const REQUIRED_MCARBON_VARS = [
  "MCARBON_BASE_URL",
  "MCARBON_USERNAME",
  "MCARBON_PASSWORD",
  "MCARBON_SENDER_ID",
] as const;

export function getOTPProvider(): OTPProvider {
  const missing: string[] = [];

  for (const key of REQUIRED_MCARBON_VARS) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required mCarbon environment variables: ${missing.join(", ")}`
    );
  }

  return new MCarbonProvider({
    baseUrl: process.env.MCARBON_BASE_URL!,
    username: process.env.MCARBON_USERNAME!,
    password: process.env.MCARBON_PASSWORD!,
    senderId: process.env.MCARBON_SENDER_ID!,
    dltEntityId: process.env.MCARBON_DLT_ENTITY_ID ?? "",
    dltTemplateId: process.env.MCARBON_DLT_TEMPLATE_ID ?? "",
  });
}

export function getFallbackOTPProvider(): OTPProvider {
  const missing: string[] = [];

  if (!process.env.TWILIO_ACCOUNT_SID) missing.push("TWILIO_ACCOUNT_SID");
  if (!process.env.TWILIO_AUTH_TOKEN) missing.push("TWILIO_AUTH_TOKEN");
  if (!process.env.TWILIO_VERIFY_SERVICE_SID) missing.push("TWILIO_VERIFY_SERVICE_SID");

  if (missing.length > 0) {
    throw new Error(
      `Missing required Twilio environment variables: ${missing.join(", ")}`
    );
  }

  return new TwilioProvider({
    accountSid: process.env.TWILIO_ACCOUNT_SID!,
    authToken: process.env.TWILIO_AUTH_TOKEN!,
    verifyServiceSid: process.env.TWILIO_VERIFY_SERVICE_SID!,
  });
}