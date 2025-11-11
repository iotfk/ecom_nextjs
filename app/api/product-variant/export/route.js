import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelperFunction";
import ProductVariantModel from "@/models/ProductVariant.model";


export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized');
        }

        await connectDB();
      
        const pipeline = [
            { $match: { deletedAt: null } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'ProductData',
                },
            },
            { $unwind: { path: '$ProductData', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    product: '$ProductData.name',
                    color: 1,
                    size: 1,
                    mrp: 1,
                    sellingPrice: 1,
                    discountPercent: 1,
                    sku: 1,
                    deletedAt: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    __v: 1,
                },
            },
            { $sort: { createdAt: -1 } },
        ]

        const getProductVariant = await ProductVariantModel.aggregate(pipeline)
        
        if (!getProductVariant || getProductVariant.length === 0) {
            return response(false, 404, 'Product variant not found');
        }

        return response(true, 200, 'Product variant fetched successfully', getProductVariant);


    } catch (error) {
        catchError(error);
    }
}