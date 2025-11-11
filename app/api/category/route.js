import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelperFunction";
import CategoryModel from "@/models/Category.model";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin');
        
        if (!auth.isAuth) {
            return response(false, 401, 'Unauthorized');
        }

        await connectDB();

        // Get query parameters for datatable
        const { searchParams } = new URL(request.url);
        const start = parseInt(searchParams.get('start')) || 0;
        const size = parseInt(searchParams.get('size')) || 10;
        const filters = JSON.parse(searchParams.get('filters') || '[]');
        const globalFilter = searchParams.get('globalFilter') || '';
        const sorting = JSON.parse(searchParams.get('sorting') || '[]');
      //  const deleteType = searchParams.get('deleteType') || 'SD';
        const deleteType = searchParams.get('deleteType');

        // Build filter object
        const filterQuery = {};

        // Handle deleteType
        if (deleteType === 'SD') {
            filterQuery.deletedAt = null;
        } else if (deleteType === 'PD') {
            filterQuery.deletedAt = { $ne: null };
        }

        // Handle global search filter
        if (globalFilter) {
            filterQuery.$or = [
                { name: { $regex: globalFilter, $options: 'i' } },
                { slug: { $regex: globalFilter, $options: 'i' } },
                { description: { $regex: globalFilter, $options: 'i' } }
            ];
        }

        // Handle column filters
        filters.forEach((filter) => {
            if (filter.value) {
                filterQuery[filter.id] = { $regex: filter.value, $options: 'i' };
            }
        });

        // Build sort object
        const sortQuery = {};
        if (sorting.length > 0) {
            sorting.forEach((sort) => {
                sortQuery[sort.id] = sort.desc ? -1 : 1;
            });
        } else {
            sortQuery.createdAt = -1;
        }


        //aggregation pipeline
        const aggregationPipeline =[
            {
                $match: filterQuery
            },
            {
                $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 }
            },
            {
                $skip: start
            },
            {
                $limit: size
            }
            ,
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    deletedAt: 1,
                  
                }
            }
        ]
        const getCategory = await CategoryModel.aggregate(aggregationPipeline)



        // Get total count for pagination
        const totalRowCount = await CategoryModel.countDocuments(filterQuery);

        // Fetch data with pagination
        // const categoryData = await CategoryModel.find(filterQuery)
        //     .sort(sortQuery)
        //     .skip(start)
        //     .limit(size)
        //     .lean();

        // ✅ Return data without nested 'data' wrapper
        // return response(true, 200, 'Category data fetched successfully', getCategory, {
        //     meta: {
        //         totalRowCount
        //     }
        // });\

        return NextResponse.json({
            data:getCategory,
            meta:{
                totalRowCount
            }
        },{
            status:200
        })

    } catch (error) {
        return catchError(error);
    }
}
