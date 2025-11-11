import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelperFunction";
import { zSchema } from "@/lib/zodSchema";
import ProductModel from "@/models/Product.model";
import { encode } from "entities";

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
            name: true,
            slug: true,
            category: true,
            mrp: true,
            sellingPrice: true,
            discountPercent: true,
            description: true,
            media: true
        })

        const validate = schema.safeParse(payload);


        if (!validate.success) {
            return response(false, 422, 'Validation Error', validate.error);
        }
        
        const validatedData = validate.data;

        const getProduct = await ProductModel
        .findOne({ deletedAt: null, _id: validatedData._id });

        if(!getProduct){
            return response(false, 404, 'Product not found');
        }
        
        getProduct.name = validatedData.name;
        getProduct.slug = validatedData.slug;
        getProduct.category = validatedData.category;
        getProduct.mrp = validatedData.mrp;
        getProduct.sellingPrice = validatedData.sellingPrice;
        getProduct.discountPercent = validatedData.discountPercent;
        getProduct.description = encode(validatedData.description);
        getProduct.media = validatedData.media;

        await getProduct.save();


       

        // console.log(newProduct);

        // await newProduct.save();




        return response(true, 201, 'Product updated successfully');

    } catch (error) {
       console.log(error);
       
    }
}