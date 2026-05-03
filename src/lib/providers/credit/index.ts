import { CreditBureauProvider } from "./types";
import { MockCreditProvider } from "./mock";
import { DecentroProvider } from "./decentro";

export function getCreditProvider(): CreditBureauProvider {
  const mode = process.env.CREDIT_PROVIDER ?? "mock";

  if (mode === "mock") {
    return new MockCreditProvider();
  }

  const missing: string[] = [];
  if (!process.env.DECENTRO_BASE_URL) missing.push("DECENTRO_BASE_URL");
  if (!process.env.DECENTRO_CLIENT_ID) missing.push("DECENTRO_CLIENT_ID");
  if (!process.env.DECENTRO_CLIENT_SECRET) missing.push("DECENTRO_CLIENT_SECRET");
  if (!process.env.DECENTRO_MODULE_SECRET) missing.push("DECENTRO_MODULE_SECRET");
  if (!process.env.DECENTRO_PROVIDER_SECRET) missing.push("DECENTRO_PROVIDER_SECRET");

  if (missing.length > 0) {
    throw new Error(
      `Missing required Decentro environment variables: ${missing.join(", ")}`
    );
  }

  return new DecentroProvider({
    baseUrl: process.env.DECENTRO_BASE_URL!,
    clientId: process.env.DECENTRO_CLIENT_ID!,
    clientSecret: process.env.DECENTRO_CLIENT_SECRET!,
    moduleSecret: process.env.DECENTRO_MODULE_SECRET!,
    providerSecret: process.env.DECENTRO_PROVIDER_SECRET!,
  });
}