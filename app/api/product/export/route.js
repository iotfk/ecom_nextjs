import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelperFunction";
import ProductModel from "@/models/Product.model";


export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized');
        }

        await connectDB();
      
 
        const filter = {
            deletedAt: null
        }

       const getProduct =  await ProductModel.find(filter).select("-description -media").sort({createdAt: -1 }).lean();
       if(!getProduct){
        return response(false, 404, 'Product not found');
       }

       return response(true, 200, 'Product fetched successfully', getProduct);


    } catch (error) {
        catchError(error);
    }

}