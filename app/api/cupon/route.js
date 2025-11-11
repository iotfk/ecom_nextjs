import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelperFunction";
import CuponModel from "@/models/Cupon.model";
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
        { code: { $regex: globalFilter, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$minShoppingAmount" },
              regex: globalFilter,
              options: "i",
            },
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$discountPercent" },
              regex: globalFilter,
              options: "i",
            },
          },
        },
      ];
    }

    filters.forEach((filter) => {
   
      if(filter.id === "discountPercent" || filter.id === "minShoppingAmount") {
        filterQuery[filter.id] = Number(filter.value);
      }else if(filter.id === "validity") {
        filterQuery[filter.id] = { $gte: new Date(filter.value) };
      }else{
        filterQuery[filter.id] = { $regex: filter.value, $options: "i" };
      }

    });

    // ---------- AGGREGATION PIPELINE ----------
   // const aggregationPipeline = [];

    // ---------- HANDLE COLUMN FILTERS ----------
    // filters.forEach((filter) => {
    //   const { id, value } = filter;
    //   if (!value) return;

    //   // numeric filters
    //   if (["discountPercent", "minShoppingAmount"].includes(id)) {
    //     const numericValue = Number(value);
    //     if (!isNaN(numericValue))
    //       aggregationPipeline.push({ $match: { [id]: numericValue } });
    //   }else if(id === "validity") {
    //     const dateValue = new Date(value);
    //     if (!isNaN(dateValue.getTime()))
    //       aggregationPipeline.push({ $match: { [id]: { $gte: dateValue } } });
    //   }
    //   // normal text filters
    //   else{
    //     aggregationPipeline.push({
    //       $match: { [id]: { $regex: value, $options: "i" } },
    //     });
    //   }
    // });




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
        discountPercent: 1,
        code: 1,
        minShoppingAmount: 1,
        validity: 1,
        createdAt: 1,
        updatedAt: 1,
        deletedAt: 1,
      }}
    ];

    // ---------- EXECUTE ----------
    const getCupons = await CuponModel.aggregate(aggregationPipeline);

   const totalRowCount = await CuponModel.countDocuments(filterQuery);

    return NextResponse.json(
      { data: getCupons, 
      meta: { totalRowCount } },
      { status: 200 }
    );
  } catch (error) {
    return catchError(error);
  }
}
