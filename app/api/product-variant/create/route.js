import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelperFunction";
import { zSchema } from "@/lib/zodSchema";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function POST(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 401, "Unauthorized");
    }

    await connectDB();

    const payload = await request.json();

    const schema = zSchema.pick({
      product: true,
      sku: true,
      color: true,
      size: true,
      mrp: true,
      sellingPrice: true,
      discountPercent: true,
      media: true,
    });

    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 422, "Validation Error", validate.error);
    }

    const newProductVariant = new ProductVariantModel(validate.data);

    await newProductVariant.save();

    return response(true, 201, "Product variant created successfully");
  } catch (error) {
    console.error("❌ Error creating product variant:");
    console.error(error.name, error.message);
    if (error.errors) console.error("Details:", error.errors);
    return response(false, 500, "Internal Server Error", error.message);
  }
}
