import { connectDB } from "@/lib/databaseConnection";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";
import z from "zod";
import { SignJWT } from "jose";
import { sendMail } from "@/lib/sendMail";
import { emailVerificationLink } from "@/email/emailVarificationLink";
import OTPModel from "@/models/Otp.model";
import { otpEmail } from "@/email/otpEmail";

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json(); // ✅ Fixed typo

    const validationSchema = zSchema.pick({
      email: true
    }).extend({
      password: z.string()
    });

    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) {
      return response(false, 400, 'Invalid or missing input fields', validatedData.error);
    }

    const { email, password } = validatedData.data;

    // Get user data with password field
    const getUser = await UserModel.findOne({ deletedAt: null, email }).select("+password"); // ✅ Fixed typo

    if (!getUser) {
      return response(false, 401, 'Invalid login credentials');
    }

    // Check if email is verified
    if (!getUser.isEmailVarified) { // ✅ Fixed capitalization
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);

      const token = await new SignJWT({ userId: getUser._id.toString() })
        .setIssuedAt()
        .setExpirationTime('1h')
        .setProtectedHeader({ alg: 'HS256' })
        .sign(secret);

      await sendMail(
        'Email Verification Required', 
        email, 
        emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`)
      );

      return response(false, 403, 'Email not verified. Please check your email.');
    }

    // Verify password
    const isPasswordValid = await getUser.comparePassword(password);

    if (!isPasswordValid) {
      return response(false, 401, 'Invalid login credentials');
    }

    // Generate and send OTP
    await OTPModel.deleteMany({ email }); // Delete old OTPs

    const otp = generateOTP();

    const newOtpData = new OTPModel({
      email,
      otp
    });

    await newOtpData.save();

    const otpEmailStatus = await sendMail('Your OTP', email, otpEmail(otp));

    if (!otpEmailStatus.success) {
      return response(false, 500, 'Failed to send OTP');
    }

    return response(true, 200, 'Please verify OTP sent to your email'); // ✅ Fixed: should be true for success

  } catch (error) {
    console.error('Login error:', error);
    return catchError(error);
  }
}
