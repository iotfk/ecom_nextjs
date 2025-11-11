import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelperFunction";
import ProductModel from "@/models/Product.model";
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

    // Global search (searches name, slug, category, prices, discount)
    if (globalFilter) {
      filterQuery.$or = [
        { name: { $regex: globalFilter, $options: "i" } },
        { slug: { $regex: globalFilter, $options: "i" } },
        { "categoryData.name": { $regex: globalFilter, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$mrp" },
              regex: globalFilter,
              options: "i",
            },
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$sellingPrice" },
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

    // ---------- AGGREGATION PIPELINE ----------
    const aggregationPipeline = [
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: { path: "$categoryData", preserveNullAndEmptyArrays: true },
      },
    ];

    // ---------- HANDLE COLUMN FILTERS ----------
    filters.forEach((filter) => {
      const { id, value } = filter;
      if (!value) return;

      // category filter (special handling)
      if (id === "category") {
        aggregationPipeline.push({
          $match: { "categoryData.name": { $regex: value, $options: "i" } },
        });
      }
      // numeric filters
      else if (["mrp", "sellingPrice", "discountPercent"].includes(id)) {
        const numericValue = Number(value);
        if (!isNaN(numericValue))
          aggregationPipeline.push({ $match: { [id]: numericValue } });
      }
      // normal text filters
      else {
        aggregationPipeline.push({
          $match: { [id]: { $regex: value, $options: "i" } },
        });
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

    aggregationPipeline.push({ $match: filterQuery });
    aggregationPipeline.push({ $sort: sortQuery });
    aggregationPipeline.push({ $skip: start });
    aggregationPipeline.push({ $limit: size });

    // ---------- PROJECT FIELDS ----------
    aggregationPipeline.push({
      $project: {
        _id: 1,
        name: 1,
        slug: 1,
        category: "$categoryData.name",
        mrp: 1,
        sellingPrice: 1,
        discountPercent: 1,
        description: 1,
        createdAt: 1,
        updatedAt: 1,
        deletedAt: 1,
      },
    });

    // ---------- EXECUTE ----------
    const getProduct = await ProductModel.aggregate(aggregationPipeline);

    // ---------- TOTAL COUNT ----------
    const countPipeline = [
      ...aggregationPipeline.filter(
        (stage) =>
          !("$skip" in stage) && !("$limit" in stage) && !("$sort" in stage)
      ),
      { $count: "total" },
    ];

    const totalCountResult = await ProductModel.aggregate(countPipeline);
    const totalRowCount = totalCountResult[0]?.total || 0;

    return NextResponse.json(
      { data: getProduct, meta: { totalRowCount } },
      { status: 200 }
    );
  } catch (error) {
    return catchError(error);
  }
}
