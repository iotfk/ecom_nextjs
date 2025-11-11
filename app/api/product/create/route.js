import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelperFunction";
import { zSchema } from "@/lib/zodSchema";
import ProductModel from "@/models/Product.model";
import { encode } from "entities";

export async function POST(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 401, 'Unauthorized')
        }
        await connectDB()

        const payload = await request.json();

        const ProductSchema = zSchema.pick({
            name: true,
            slug: true,
            category: true,
            mrp: true,
            sellingPrice: true,
            discountPercent: true,
            description: true,
            media: true
        })

        const validate = ProductSchema.safeParse(payload);

        if (!validate.success) {
            return response(false, 422, 'Validation Error', validate.error);
        }

        const ProductData = validate.data;

        const newProduct = new ProductModel({
            name: ProductData.name,
            slug: ProductData.slug,
            category: ProductData.category,
            mrp: ProductData.mrp,
            sellingPrice: ProductData.sellingPrice,
            discountPercent: ProductData.discountPercent,
            description: encode(ProductData.description),
            media: ProductData.media
        })

        console.log(newProduct);

        await newProduct.save();




        return response(true, 201, 'Product created successfully');

    } catch (error) {
       console.log(error);
       
    }
}