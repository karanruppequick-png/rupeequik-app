// Shared OTP store used by both send and verify routes
// In production, replace with Redis or database-backed storage
const otpStore = new Map<string, { otp: string; expires: number }>();

export { otpStore };
