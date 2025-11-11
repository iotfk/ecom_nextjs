import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelperFunction";
import ProductModel from "@/models/Product.model";

// Soft Delete (Move to Trash)
export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return response(false, 401, 'Unauthorized');
        }

        await connectDB();

    const payload = await request.json()    

    const ids = payload.ids || []
    const deleteType = payload.deleteType || 'SD'

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return response(false, 400, 'Invalid IDs provided');
        }

        const product = await ProductModel.find({ _id: { $in: ids } })
        if (!product || product.length === 0) {
            return response(false, 400, 'No Product with provided ID');
        }

if (!['SD', 'RSD'].includes(deleteType)) {
    return response(false, 400, 'Invalid delete type');
}

        let result;
        
        if (deleteType === 'SD') {
            // Soft Delete - Set deletedAt to current date
            result = await ProductModel.updateMany(
                { _id: { $in: ids } },
                { $set: { deletedAt: new Date() } }
            );
        } else if (deleteType === 'RSD') {
            // Restore Soft Delete - Set deletedAt to null
            result = await ProductModel.updateMany(
                { _id: { $in: ids } },
                { $set: { deletedAt: null } }
            );
        } else {
            return response(false, 400, 'Invalid delete type');
        }

        return response(
            true, 
            200, 
            `${result.modifiedCount} ${result.modifiedCount === 1 ? 'product' : 'products'}
             ${deleteType === 'RSD' ? 'restored' : 'deleted'} successfully`
        );

    } catch (error) {
        return catchError(error);
    }
}

// Permanent Delete
export async function DELETE(request) {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return response(false, 401, 'Unauthorized');
        }

        await connectDB();

        const { ids } = await request.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return response(false, 400, 'Invalid IDs provided');
        }

      
        // Permanent Delete
        const result = await ProductModel.deleteMany({
            _id: { $in: ids }
        });

        return response(
            true, 
            200, 
            `${result.deletedCount} 
            ${result.deletedCount === 1 ? 'product' : 'products'} permanently deleted`
        );

    } catch (error) {
        return catchError(error);
    }
}
