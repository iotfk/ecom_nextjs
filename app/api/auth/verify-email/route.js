import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/User.model";
import { jwtVerify } from "jose";

export async function POST(request){
    try {
        await connectDB()
        const {token} = await request.json()

        if(!token){
            return response(false, 400, 'Missing Token')
        }
        const secret  = new TextEncoder().encode(process.env.SECRET_KEY)
        const decode = await jwtVerify(token, secret )

        const userId = decode.payload.userId

        //getUser
        const user= await UserModel.findById(userId)

        if(!user){
            return response(false, 404, 'user not found')
        }

        user.isEmailVarified = true
        await user.save()
         return response(true, 200, 'Email verified')

    } catch (error) {
        return catchError(error)
    }
}