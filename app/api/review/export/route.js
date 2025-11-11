import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelperFunction";
import ReviewModel from "@/models/Review.model";
import ProductModel from "@/models/Product.model";
import UserModel from "@/models/User.model";


export async function GET() {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 401, "Unauthorized");

    await connectDB();

    const docs = await ReviewModel.find({ deletedAt: null })
      .select("_id product user rating title review createdAt")
      .populate({ path: "product", select: "name" })
      .populate({ path: "user", select: "name" })
      .sort({ createdAt: -1 })
      .lean();

    const reviews = docs.map((d) => ({
      _id: d._id,
      product: typeof d.product === "object" ? d.product?.name ?? "" : d.product,
      user: typeof d.user === "object" ? d.user?.name ?? "" : d.user,
      rating: d.rating,
      title: d.title,
      review: d.review,
      createdAt: d.createdAt,
    }));

    return response(true, 200, "Reviews exported successfully", reviews);
  } catch (error) {
    return catchError(error);
  }
}
