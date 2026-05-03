import { OTPProvider, MCarbonConfig, OtpResult } from "./types";

export class MCarbonProvider implements OTPProvider {
  private readonly config: MCarbonConfig;

  constructor(config: MCarbonConfig) {
    this.config = config;
  }

  async sendOTP(
    phone: string,
    _otp: string,
    templateMessage: string
  ): Promise<OtpResult> {
    console.log("[mCarbon] Sending SMS to", phone.slice(-4).padStart(10, "*"));

    try {
      const url = new URL(this.config.baseUrl);
      url.searchParams.set("username", this.config.username);
      url.searchParams.set("password", this.config.password);
      url.searchParams.set("unicode", "false");
      url.searchParams.set("from", this.config.senderId);
      url.searchParams.set("to", `91${phone}`);
      url.searchParams.set("text", templateMessage);
      if (this.config.dltTemplateId) {
        url.searchParams.set("dltContentId", this.config.dltTemplateId);
      }

      const response = await fetch(url.toString(), {
        method: "GET",
      });

      const responseText = await response.text();

      if (!response.ok) {
        return {
          success: false,
          error: `mCarbon HTTP ${response.status}: ${responseText}`,
        };
      }

      // Parse response — try JSON first, fall back to text
      let data: Record<string, unknown> = {};
      try {
        data = JSON.parse(responseText) as Record<string, unknown>;
      } catch {
        // non-JSON response — treat as raw status
        data = { raw: responseText };
      }

      // Common success/error fields across providers
      const status = String(data.status ?? data.Status ?? data.error ?? "");
      const successIndicators = ["success", "Success", "SUC", "1", "DONE", "OK", "delivered"];
      const isSuccess = successIndicators.some((s) => status.includes(s))
        || (response.ok && typeof data.error !== "string");

      if (isSuccess) {
        return {
          success: true,
          messageId: String(data.messageId ?? data.id ?? data.taskId ?? data.msgid ?? status),
        };
      }

      return {
        success: false,
        error: String(data.error_message ?? data.error ?? data.Status ?? responseText),
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown network error";
      return { success: false, error: message };
    }
  }
}