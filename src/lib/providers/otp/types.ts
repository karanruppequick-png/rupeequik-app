export interface MCarbonConfig {
  baseUrl: string;
  username: string;
  password: string;
  senderId: string;
  dltEntityId: string;
  dltTemplateId: string;
}

export interface OtpResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface OTPProvider {
  sendOTP(
    phone: string,
    otp: string,
    templateMessage: string
  ): Promise<OtpResult>;
}