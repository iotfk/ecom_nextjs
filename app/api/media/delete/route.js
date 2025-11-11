// import cloudinary from "@/lib/cloudinary";
// import { connectDB } from "@/lib/databaseConnection";
// import { catchError, response } from "@/lib/helperFunction";
// import { isAuthenticated } from "@/lib/serverHelperFunction";
// import MediaModel from "@/models/Media.model";

// export async function PUT(request) {
//     try {
//         const auth  = await isAuthenticated('admin') 

//         if (!auth.isAuth) {
//             return response(false, 403, 'Unauthorized');
//         }

//         await connectDB();

//         const payload = await request.json();
//          const ids = payload.ids || []; // ✅ Accept both
//         const deleteType = payload.deleteType || 'SD'; // 'SD' for soft delete, 'PD' for permanent delete
         
//          if(!Array.isArray(ids) || ids.length === 0){
//             return response(false, 400, 'No media IDs provided');
//          }

//         const media = await MediaModel.find({ _id: { $in: ids } }).lean();
//         if (media.length === 0) {
//             return response(false, 404, 'No media found for the provided IDs');
//         }

//         if(!['SD', 'RSD'].includes(deleteType)){
//             return response(false, 400, 'Invalid delete type for PUT request');
//         }

//         if(deleteType === 'SD'){
//             // Soft delete - mark as deleted
//             await MediaModel.updateMany(
//                 { _id: { $in: ids } },
//                 { $set: { isDeleted: true, deletedAt: new Date().toISOString() } }
//             );
//             return response(true, 200, 'Media soft deleted successfully');


//         } else if(deleteType === 'RSD'){
//             // Restore soft deleted media
//             await MediaModel.updateMany(
//                 { _id: { $in: ids } },
//                 { $set: { isDeleted: false }, $unset: { deletedAt: null } }
//             );
//             return response(true, 200, 'Media restored successfully');
//         } 

//     } catch (error) {
//         return catchError(error);
//     }
// }


// export async function DELETE(request) {
//   try {
//     const auth = await isAuthenticated('admin');
//     if (!auth.isAuth) {
//       return response(false, 403, 'Unauthorized');
//     }

//     await connectDB();

//     const payload = await request.json();
//     const ids = payload.ids || [];
//     const deleteType = payload.deleteType || 'SD';

//     if (!Array.isArray(ids) || ids.length === 0) {
//       return response(false, 400, 'No media IDs provided');
//     }

//     const media = await MediaModel.find({ _id: { $in: ids } }).lean();
//     if (media.length === 0) {
//       return response(false, 404, 'No media found for the provided IDs');
//     }

//     if (deleteType !== 'PD') {
//       return response(false, 400, 'Invalid delete type — should be PD for DELETE request');
//     }

//     // Get all public IDs before deleting DB records
//     const publicIds = media.map((m) => m.public_id).filter(Boolean);

//     // 1️⃣ Delete from Cloudinary first
//     try {
//       if (publicIds.length > 0) {
//         await cloudinary.api.delete_resources(publicIds);
//       }
//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//       console.error('Cloudinary deletion failed:', error);
//       return response(false, 500, 'Failed to delete from Cloudinary');
//     }

//     // 2️⃣ Delete from MongoDB
//     await MediaModel.deleteMany({ _id: { $in: ids } });

//     return response(true, 200, 'Media permanently deleted from DB and Cloudinary successfully');
//   } catch (error) {
//     return catchError(error);
//   }
// }












import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelperFunction";
import MediaModel from "@/models/Media.model";
import mongoose from "mongoose";


export async function PUT(request) {
    try {
        const auth  = await isAuthenticated('admin') 


        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized');
        }


        await connectDB();


        const payload = await request.json();
         const ids = payload.ids || []; // ✅ Accept both
        const deleteType = payload.deleteType || 'SD'; // 'SD' for soft delete, 'PD' for permanent delete
         
         if(!Array.isArray(ids) || ids.length === 0){
            return response(false, 400, 'No media IDs provided');
         }


        const media = await MediaModel.find({ _id: { $in: ids } }).lean();
        if (media.length === 0) {
            return response(false, 404, 'No media found for the provided IDs');
        }


        if(!['SD', 'RSD'].includes(deleteType)){
            return response(false, 400, 'Invalid delete type for PUT request');
        }


        if(deleteType === 'SD'){
            // Soft delete - mark as deleted
            await MediaModel.updateMany(
                { _id: { $in: ids } },
                { $set: { isDeleted: true, deletedAt: new Date().toISOString() } }
            );
            return response(true, 200, 'Media soft deleted successfully');



        } else if(deleteType === 'RSD'){
            // Restore soft deleted media
            await MediaModel.updateMany(
                { _id: { $in: ids } },
                { $set: { isDeleted: false }, $unset: { deletedAt: 1 } }
            );
            return response(true, 200, 'Media restored successfully');
        } 


    } catch (error) {
        return catchError(error);
    }
}



export async function DELETE(request) {
  const session = await mongoose.startSession();
  
  try {
    const auth = await isAuthenticated('admin');
    if (!auth.isAuth) {
      return response(false, 403, 'Unauthorized');
    }

    await connectDB();

    const payload = await request.json();
    const ids = payload.ids || [];
    const deleteType = payload.deleteType || 'SD';

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, 'No media IDs provided');
    }

    // Start transaction
    session.startTransaction();

    // Find media with session
    const media = await MediaModel.find({ _id: { $in: ids } }).session(session).lean();
    if (media.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return response(false, 404, 'No media found for the provided IDs');
    }

    if (deleteType !== 'PD') {
      await session.abortTransaction();
      session.endSession();
      return response(false, 400, 'Invalid delete type — should be PD for DELETE request');
    }

    // Get all public IDs before deleting DB records
    const publicIds = media.map((m) => m.public_id).filter(Boolean);

    // 1️⃣ Delete from Cloudinary first
    try {
      if (publicIds.length > 0) {
        await cloudinary.api.delete_resources(publicIds);
      }
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error('Cloudinary deletion failed:', error);
      return response(false, 500, 'Failed to delete from Cloudinary');
    }

    // 2️⃣ Delete from MongoDB with session
    await MediaModel.deleteMany({ _id: { $in: ids } }).session(session);

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return response(true, 200, 'Media permanently deleted ');
    
  } catch (error) {
    // Abort transaction on any error
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    return catchError(error);
  }
}
