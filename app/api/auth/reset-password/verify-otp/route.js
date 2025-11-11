import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import { cookies } from "next/headers";


export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json()

        const validationSchema = zSchema.pick({
            otp: true,
            email: true
        })

        const validatedData = validationSchema.safeParse(payload)
        if (!validatedData.success) {
            return response(false, 401, ' Invalid or Missing input Field', validatedData.error)
        }

        const { email, otp } = validatedData.data

        const getOtpData = await OTPModel.findOne({ email, otp })

        if (!getOtpData) {
            return response(false, 401, ' Invalid or expired otp')
        }

        const getUser = await UserModel.findOne({ deletedAt: null, email }).lean()

        if (!getUser) {
            return response(false, 401, ' User Not Found ', validatedData.error)
        }


     


        await getOtpData.deleteOne()
        return response(true, 200, 'OTP Varified');

    } catch (error) {
        return catchError(error)
    }
}