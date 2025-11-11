import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelperFunction";
import { zSchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/Category.model";


export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth){
            return response(false, 401, 'Unauthorized')
        }
        await connectDB()

        const payload = await request.json();

        const schema = zSchema.pick({
            _id: true,
            name: true,
            slug: true,
        })

        const validate = schema.safeParse(payload);

        if (!validate.success) {
            return response(false, 422, 'Validation Error', validate.error);
        }

        const { _id, name, slug } = validate.data;

        const getCategory = await CategoryModel.findOne({deletedAt: null , _id });
        
        if(!getCategory){
            return response(false, 404, 'Category not found');
        }

       getCategory.name = name;
       getCategory.slug = slug;

       await getCategory.save();

        return response(true, 201, 'Category updated successfully');

    } catch (error) {
        catchError(error)
    }
}