import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, generateOTP , response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";

export async function POST(request) {
    try {

        await connectDB()
        const payload = await request.json();

        const validationSchema = zSchema.pick({
            email: true
        });

        const validatedData = validationSchema.safeParse(payload);

        if (!validatedData.success) {
            return response(false, 400, 'Missing or invalid email', validatedData.error);
        }

        const { email } = validatedData.data;

        // Check if user exists
        const getUser = await UserModel.findOne({ deletedAt: null, email }).lean();

        if (!getUser) {
            return response(false, 404, 'User not found');
        }

        // Optional: Check if email is verified
        if (!getUser.isEmailVarified) {
            return response(false, 403, 'Please verify your email first');
        }

        // Delete old OTPs for this email
        await OTPModel.deleteMany({ email });

        // Generate new OTP
        const otp = generateOTP();

        // Save new OTP
        const newOtpData = new OTPModel({
            email,
            otp
        });

        await newOtpData.save();

 
        

        // Send OTP email
        const otpSendStatus = await sendMail('Your OTP', email, otpEmail(otp));

        if (!otpSendStatus.success) {
            return response(false, 500, 'Failed to resend OTP');
        }

        return response(true, 200, 'OTP resent successfully');

    } catch (error) {
        catchError(error)
    }
}