import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelperFunction";
import CategoryModel from "@/models/Category.model";
import ProductModel from "@/models/Product.model";
import UserModel from "@/models/User.model";


export async function GET() {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized')
        }
        await connectDB()

        const[category, product, customer] = await Promise.all([
            CategoryModel.countDocuments({deletedAt: null}),
            ProductModel.countDocuments({deletedAt: null}),
            UserModel.countDocuments({deletedAt: null})
        ])

        return response(true, 200, 'Dashboard count', {category, product, customer})
    } catch (error) {
        catchError(error)
    }

}
