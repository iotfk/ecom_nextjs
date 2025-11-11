import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelperFunction";
import CategoryModel from "@/models/Category.model";
import mongoose from "mongoose";

export async function GET(request, { params }) {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized');
        }

        await connectDB();
      
 
        const filter = {
            deletedAt: null
        }

       const getCategory =  await CategoryModel.find(filter).sort({createdAt: -1 }).lean();
       if(!getCategory){
        return response(false, 404, 'Category not found');
       }

       return response(true, 200, 'Category fetched successfully', getCategory);


    } catch (error) {
        catchError(error);
    }

}