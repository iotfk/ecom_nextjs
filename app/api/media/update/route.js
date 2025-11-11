import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelperFunction";
import { zSchema } from "@/lib/zodSchema";
import MediaModel from "@/models/Media.model";
import mongoose from "mongoose";

export async function PUT(request) { // ✅ Changed from { request } to request
    try {
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized');
        }

        await connectDB();

        const payload = await request.json();

        const schema = zSchema.pick({
            _id: true,
            alt: true,
            title: true,
        })

        const validate = schema.safeParse(payload);

        if (!validate.success) {
            return response(false, 400, `Validation Error: ${validate.error.errors[0].message}`);
        }

        const { _id, alt, title } = validate.data;

        if (!mongoose.isValidObjectId(_id)) {
            return response(false, 400, 'Invalid media ID');
        }

        const getMedia = await MediaModel.findById(_id);

        if (!getMedia) {
            return response(false, 404, 'Media not found with Id provided');
        }

        getMedia.alt = alt;
        getMedia.title = title;
        await getMedia.save();
        
        return response(true, 200, 'Media updated successfully', getMedia);

    } catch (error) {
        return catchError(error); // ✅ Added return statement
    }
}
