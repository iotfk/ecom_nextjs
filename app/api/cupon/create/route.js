import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelperFunction";
import { zSchema } from "@/lib/zodSchema";
import CuponModel from "@/models/Cupon.model";


export async function POST(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 401, 'Unauthorized')
        }
        await connectDB()

        const payload = await request.json();

        const schema = zSchema.pick({
            code: true,
            discountPercent: true,
            minShoppingAmount: true,
            validity: true,
        })

        const validate = schema.safeParse(payload);

        if (!validate.success) {
            return response(false, 422, 'Validation Error', validate.error);
        }

        const CuponData = validate.data;

        const newCupon = new CuponModel({
            code: CuponData.code,
            discountPercent: CuponData.discountPercent,
            minShoppingAmount: CuponData.minShoppingAmount,
            validity: CuponData.validity,

        })

        // console.log(newCupon);

        await newCupon.save();




        return response(true, 201, 'Cupon created successfully');

    } catch (error) {
        console.log(error);

    }
}