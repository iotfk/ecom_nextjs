import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { NextResponse } from "next/server";
import { success } from "zod";

export async function POST(request) {
    try {
        // await connectDB()
        const payload = await request.json()

        const { paramsToSign } = payload
       // console.log(payload);

       const signature = cloudinary.utils.api_sign_request( paramsToSign, process.env.CLOUDINARY_API_SECRET )
        return NextResponse.json({ signature })

    } catch (error) {
        catchError(error)
    }
}