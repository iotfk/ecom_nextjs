import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelperFunction";
import { zSchema } from "@/lib/zodSchema";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 401, 'Unauthorized')
        }
        await connectDB()

        const payload = await request.json();

        const schema = zSchema.pick({
            _id: true,
            product: true,
            sku: true,
            color: true,
            size: true,
            mrp: true,
            sellingPrice: true,
            discountPercent: true,
            media: true,
        })

        const validate = schema.safeParse(payload);


        if (!validate.success) {
            return response(false, 422, 'Validation Error', validate.error);
        }

        const validatedData = validate.data;

        const getProductVariant = await ProductVariantModel
            .findOne({ deletedAt: null, _id: validatedData._id });

        if (!getProductVariant) {
            return response(false, 404, 'Product variant not found');
        }

        getProductVariant.product = validatedData.product;
        getProductVariant.sku = validatedData.sku;
        getProductVariant.color = validatedData.color;
        getProductVariant.size = validatedData.size;
        getProductVariant.mrp = validatedData.mrp;
        getProductVariant.sellingPrice = validatedData.sellingPrice;
        getProductVariant.discountPercent = validatedData.discountPercent;
        getProductVariant.media = validatedData.media;

        await getProductVariant.save();

        // console.log(newProduct);

        // await newProduct.save();




        return response(true, 201, 'Product variant updated successfully');

    } catch (error) {
        console.log(error);

    }
}