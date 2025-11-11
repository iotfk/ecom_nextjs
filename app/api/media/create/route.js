import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelperFunction";
import MediaModel from "@/models/Media.model";

export async function POST(request) {

let payload;
  
  try {
    payload = await request.json();
    
    // ✅ Check authentication
    const auth = await isAuthenticated('admin');
    
    if (!auth.isAuth) {
      return response(false, 401, auth.message || 'Unauthorized');
    }

    await connectDB();

   const newMedia = await MediaModel.insertMany(payload);
    
    return response(true, 200, "Media uploaded successfully", newMedia);
    
  } catch (error) {
    console.error("Error in /api/media/create:", error);

    if (payload && payload.length > 0) {
      const publicIds = payload.map((data) => data.public_id);

      try {
        await cloudinary.api.delete_resources(publicIds);
        console.log('Cleaned up Cloudinary files:', publicIds);
      } catch (deleteError) {
        console.error("Cloudinary cleanup failed:", deleteError);
      }
    }

    return catchError(error);
  }
}
