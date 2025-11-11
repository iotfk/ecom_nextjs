import { catchError } from "@/lib/helperFunction"
import { isAuthenticated } from "@/lib/serverHelperFunction"
import UserModel from "@/models/User.model";
import { connectDB } from "@/lib/databaseConnection";
import { NextResponse } from "next/server";

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
        { name: { $regex: globalFilter, $options: "i" } },
        { email: { $regex: globalFilter, $options: "i" } },
        { phone: { $regex: globalFilter, $options: "i" } },
        { address: { $regex: globalFilter, $options: "i" } },
        {isEmailVarified: { $regex: globalFilter, $options: "i" } },
      ];
    }

    filters.forEach((filter) => {
       filterQuery[filter.id] = { $regex: filter.value, $options: "i" };
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
      { $match: filterQuery },
      { $sort: sortQuery },
      { $skip: start },
      { $limit: size },

      { $project: {
        _id: 1,
        name: 1,
        email: 1,
        phone: 1,
        address: 1,
        isEmailVarified: 1,
        createdAt: 1,
        updatedAt: 1,
        deletedAt: 1,
      }}
    ];

    // ---------- EXECUTE ----------
    const getUsers = await UserModel.aggregate(aggregationPipeline);

   const totalRowCount = await UserModel.countDocuments(filterQuery);

    return NextResponse.json(
      { data: getUsers, 
      meta: { totalRowCount } },
      { status: 200 }
    );
  } catch (error) {
    return catchError(error);
  }
}
