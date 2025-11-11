import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelperFunction";
import { zSchema } from "@/lib/zodSchema";
import CuponModel from "@/models/Cupon.model";


export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 401, 'Unauthorized')
        }
        await connectDB()

        const payload = await request.json();

        const schema = zSchema.pick({
            _id: true,
            code: true,
            discountPercent: true,
            minShoppingAmount: true,
            validity: true,
        })
        const validate = schema.safeParse(payload);


        if (!validate.success) {
            return response(false, 422, 'Validation Error', validate.error);
        }

        const validatedData = validate.data;

        const getCupon = await CuponModel
            .findOne({ deletedAt: null, _id: validatedData._id });

        if (!getCupon) {
            return response(false, 404, 'Cupon not found');
        }

        getCupon.code = validatedData.code;
        getCupon.discountPercent = validatedData.discountPercent;
        getCupon.minShoppingAmount = validatedData.minShoppingAmount;
        getCupon.validity = validatedData.validity;

        await getCupon.save();

        // console.log(newProduct);

        // await newProduct.save();
  return response(true, 201, 'Cupon updated successfully');

    } catch (error) {
        console.log(error);

    }
}