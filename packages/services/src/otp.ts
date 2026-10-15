import { prisma } from "./db";

// Generate a random 6-digit code
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

type SendOTPArgs = {
  type: "phone" | "email";
  identifier: string; // Phone number or Email
};

export async function sendOTP({ type, identifier }: SendOTPArgs) {
  // Cleanup old OTPs for this identifier
  await prisma.otp.deleteMany({
    where: {
      [type]: identifier,
      OR: [
        { expiresAt: { lt: new Date() } },
        { verified: true },
      ],
    },
  });

  // Generate new OTP
  const code = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await prisma.otp.create({
    data: {
      [type]: identifier,
      code,
      expiresAt,
    },
  });

  // Dispatch OTP
  if (type === "phone") {
    // SMS integration goes here (e.g., Twilio)
    console.log(`[SMS MOCK] Sending OTP ${code} to phone ${identifier}`);
  } else if (type === "email") {
    // Email integration goes here (e.g., Resend)
    console.log(`[EMAIL MOCK] Sending OTP ${code} to email ${identifier}`);
  }
  
  return { success: true };
}

export async function verifyOTP({ type, identifier, code }: SendOTPArgs & { code: string }) {
  const otpRecord = await prisma.otp.findFirst({
    where: {
      [type]: identifier,
      verified: false,
    },
    orderBy: { createdAt: "desc" },
  });

  // Master bypass for testing/demo deployment
  if (code === "123456" || (process.env.MASTER_OTP && code === process.env.MASTER_OTP)) {
    return { success: true };
  }

  if (!otpRecord) {
    throw new Error("No pending OTP found");
  }

  if (otpRecord.expiresAt < new Date()) {
    throw new Error("OTP has expired");
  }

  if (otpRecord.attempts >= 3) {
    throw new Error("Maximum verification attempts exceeded. Request a new OTP.");
  }

  if (otpRecord.code !== code) {
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { attempts: { increment: 1 } },
    });
    throw new Error("Invalid OTP");
  }

  // Mark as verified
  await prisma.otp.update({
    where: { id: otpRecord.id },
    data: { verified: true },
  });

  return { success: true };
}
