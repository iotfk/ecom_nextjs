import { emailVerificationLink } from "@/email/emailVarificationLink";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

export async function POST(requst) {
  try {
        await connectDB()
        // val schema
        const validationSchema = zSchema.pick({
            name: true, email: true, password: true
        })

        const paylod = await requst.json()

        const validatedData = validationSchema.safeParse(paylod)

        if (!validatedData.success) {
            return response(false, 401, 'invalid or missing input fields', validatedData.error)
        }

        const { name, email, password } = validatedData.data

        const checkUser = await UserModel.exists({ email })

        if (checkUser) {
            return response(true, 409, 'User Already Created')
        }

        // new

        const newRegistration = new UserModel({
            name, email, password
        })
        await newRegistration.save()


        const secret = new TextEncoder().encode(process.env.SECRET_KEY)
        
        const token = await new SignJWT({ userId: newRegistration._id.toString() })
            .setIssuedAt()
            .setExpirationTime('1h')
            .setProtectedHeader({ alg: 'HS256' })
            .sign(secret)

            await sendMail('Email Varification req', email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`))

            return response(true, 200, 'Registration Success plz Varify mail')

    } catch (error) {
            catchError(error)
    }

}