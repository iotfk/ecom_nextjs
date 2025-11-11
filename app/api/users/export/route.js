import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelperFunction";
import UserModel from "@/models/User.model";

export async function GET() {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 401, "Unauthorized");

    await connectDB();

    const users = await UserModel.find({deletedAt: null})
      .select("_id name email phone address isEmailVarified createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return response(true, 200, "Users exported successfully", users);
  } catch (error) {
    return catchError(error);
  }
}
