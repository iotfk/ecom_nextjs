import { catchError } from "@/lib/helperFunction"
import { isAuthenticated } from "@/lib/serverHelperFunction"
import { connectDB } from "@/lib/databaseConnection";
import { NextResponse } from "next/server";
import ReviewModel from "@/models/Review.model";

export async function GET(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 401, "Unauthorized");

    await connectDB();

    const { searchParams } = new URL(request.url);
    const start = parseInt(searchParams.get("start")) || 0;
    const size = parseInt(searchParams.get("size")) || 10;
    const filters = JSON.parse(searchParams.get("filters") || "[]");
    const globalFilter = searchParams.get("globalFilter") || "";
    const sorting = JSON.parse(searchParams.get("sorting") || "[]");
    const deleteType = searchParams.get("deleteType");

    // ---------- FILTER BUILDER ----------
    const filterQuery = {};

    // Handle soft delete filters
    if (deleteType === "SD") filterQuery.deletedAt = null;
    else if (deleteType === "PD") filterQuery.deletedAt = { $ne: null };

    // Global search (searches code, numeric amounts, and discount)
    if (globalFilter) {
      filterQuery.$or = [
        { "productData.name": { $regex: globalFilter, $options: "i" } },
        { rating: { $regex: globalFilter, $options: "i" } },
        { title: { $regex: globalFilter, $options: "i" } },
        { review: { $regex: globalFilter, $options: "i" } },
        {"userData.name": { $regex: globalFilter, $options: "i" } },
      ];
    }

    filters.forEach((filter) => {
      if(filter.id === "product") {
        filterQuery["productData.name"] = { $regex: filter.value, $options: "i" };
      }else if(filter.id === "user") {
        filterQuery["userData.name"] = { $regex: filter.value, $options: "i" };
      }else{
        filterQuery[filter.id] = { $regex: filter.value, $options: "i" };
      }
    });

    // ---------- SORT ----------
    const sortQuery = {};
    if (sorting.length > 0) {
      sorting.forEach((sort) => {
        sortQuery[sort.id] = sort.desc ? -1 : 1;
      });
    } else {
      sortQuery.createdAt = -1;
    }

    const aggregationPipeline = [
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productData",
        },
      },{
          $unwind:{path: "$productData", preserveNullAndEmptyArrays: true}
      },{
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
          $unwind:{path: "$userData", preserveNullAndEmptyArrays: true}
      },

      { $match: filterQuery },
      { $sort: sortQuery },
      { $skip: start },
      { $limit: size },

      { $project: {
        _id: 1,
        product: "$productData.name",
        user: "$userData.name",
        rating: 1,
        title: 1,
        review: 1,
        createdAt: 1,
        updatedAt: 1,
        deletedAt: 1,
      }}
    ];

    // ---------- EXECUTE ----------
    const getReviews = await ReviewModel.aggregate(aggregationPipeline);

   const totalRowCount = await ReviewModel.countDocuments(filterQuery);

    return NextResponse.json(
      { data: getReviews, 
      meta: { totalRowCount } },
      { status: 200 }
    );
  } catch (error) {
    return catchError(error);
  }
}
