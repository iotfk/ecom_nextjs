import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelperFunction";
import CategoryModel from "@/models/Category.model";
import mongoose from "mongoose";

// Soft Delete (Move to Trash)
export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return response(false, 401, 'Unauthorized');
        }

        await connectDB();

        const { ids, deleteType } = await request.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return response(false, 400, 'Invalid IDs provided');
        }

        // Validate all IDs
        const validIds = ids.filter(id => mongoose.isValidObjectId(id));
        if (validIds.length === 0) {
            return response(false, 400, 'No valid IDs provided');
        }

        let result;
        
        if (deleteType === 'SD') {
            // Soft Delete - Set deletedAt to current date
            result = await CategoryModel.updateMany(
                { _id: { $in: validIds } },
                { $set: { deletedAt: new Date() } }
            );
        } else if (deleteType === 'RSD') {
            // Restore Soft Delete - Set deletedAt to null
            result = await CategoryModel.updateMany(
                { _id: { $in: validIds } },
                { $set: { deletedAt: null } }
            );
        } else {
            return response(false, 400, 'Invalid delete type');
        }

        return response(
            true, 
            200, 
            `${result.modifiedCount} ${result.modifiedCount === 1 ? 'category' : 'categories'} ${deleteType === 'RSD' ? 'restored' : 'deleted'} successfully`
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

        // Validate all IDs
        const validIds = ids.filter(id => mongoose.isValidObjectId(id));
        if (validIds.length === 0) {
            return response(false, 400, 'No valid IDs provided');
        }

        // Permanent Delete
        const result = await CategoryModel.deleteMany({
            _id: { $in: validIds }
        });

        return response(
            true, 
            200, 
            `${result.deletedCount} ${result.deletedCount === 1 ? 'category' : 'categories'} permanently deleted`
        );

    } catch (error) {
        return catchError(error);
    }
}
