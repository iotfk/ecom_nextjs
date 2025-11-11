import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelperFunction";
import MediaModel from "@/models/Media.model";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // ✅ Check authentication
    const auth = await isAuthenticated('admin');

    if (!auth.isAuth) {
      return response(false, 401, auth.message || 'Unauthorized');
    }

    // ✅ Connect to database
    await connectDB();

    // ✅ Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page'), 10) || 0;
    const limit = parseInt(searchParams.get('limit'), 10) || 10;
    const deleteType = searchParams.get('deleteType') || 'SD';
    const skip = page * limit;

    // ✅ Build filter - Fixed field name
    let filter = {};

    if (deleteType === 'SD') {
      filter = { deletedAt: null };  // ✅ Fixed: deletedAt not deleteAt
    } else if (deleteType === 'PD') {
      filter = { deletedAt: { $ne: null } };
    }

    // ✅ Fetch media - Fixed sorting and pagination
    const mediaData = await MediaModel.find(filter)
      .sort({ createdAt: -1 })  // ✅ Sort by creation date
      .skip(skip)
      .limit(limit)
      .lean();

    const totalMedia = await MediaModel.countDocuments(filter);

    // ✅ Return success response
    return NextResponse.json({
      success: true,
      mediaData: mediaData,
      hasMore: (page + 1) * limit < totalMedia,
      totalCount: totalMedia,
      currentPage: page
    });

  } catch (error) {
    console.error('Error fetching media:', error);
    return catchError(error);
  }
}
