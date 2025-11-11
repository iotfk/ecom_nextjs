import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelperFunction";
import CuponModel from "@/models/Cupon.model";
import mongoose from "mongoose";

export async function GET(request, { params }) {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized');
        }

        await connectDB();
        const getParams = await params;
        const id = getParams.id;
 
  
        const filter = {
            deletedAt: null
        }

        if (!mongoose. isValidObjectId(id)) {
            return response(false, 400, 'Invalid cupon ID');
        }

        filter._id = id;
  
        const getCupon = await CuponModel.findOne(filter).lean();

        if (!getCupon) {
            return response(false, 404, 'Cupon not found');
        }   
        return response(true, 200, 'Cupon fetched successfully', getCupon);

    } catch (error) {
        catchError(error);
    }

}