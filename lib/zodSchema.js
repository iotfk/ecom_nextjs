import { coerce, z } from 'zod';

const nameRegexLatin = /^[A-Za-z][A-Za-z' -]{1,49}$/; // 2–50 chars, starts with a letter



// Helper to coerce string/number to number, or throw validation error if not possible
const stringToNumber = z.preprocess((val) => {
  if (typeof val === "string" && !isNaN(Number(val))) {
    return Number(val);
  }
  return val;
}, z.number());

// Helper to coerce string/date to Date, or throw validation error if not possible
const stringToDate = z.preprocess((val) => {
  if (typeof val === "string" || val instanceof Date) {
    const date = new Date(val);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  return val;
}, z.date());

export const zSchema = z.object({
  // ✅ Email validation
  email: z
    .string()
    .email({ message: "Invalid email address" }),

  // ✅ Password validation
  password: z
    .string()
    .min(8, "Must be at least 8 characters")
    .max(128, "Must be at most 128 characters")
    .refine((v) => /[A-Z]/.test(v), "Must include an uppercase letter")
    .refine((v) => /[a-z]/.test(v), "Must include a lowercase letter")
    .refine((v) => /\d/.test(v), "Must include a number")
    .refine(
      (v) => /[!@#$%^&*()[\]{};:'",.<>/?\\|~\-_=+]/.test(v),
      "Must include a special character"
    )
    .refine((v) => !/\s/.test(v), "Must not contain spaces")
    .refine((v) => !/(.)\1\1/.test(v), "Must not contain 3 identical characters in a row"),

  // ✅ Name validation
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
    // .regex(
    //   nameRegexLatin,
    //   "Name can contain letters, spaces, hyphens and apostrophes"
   // ),
  // Alternative:
  // .regex(nameRegexUnicode, "Name can contain Unicode letters, spaces, hyphens and apostrophes")

  // ✅ OTP
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),

  // ✅ General identifiers and metadata
  _id: z.string().min(3, "_id is required"),
  alt: z.string().max(150, "Alt text must be at most 150 characters"),
  title: z.string().max(100, "Title must be at most 100 characters"),

  // ✅ Slug and category
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(100, "Slug must be at most 100 characters"),

  category: z
    .string()
    .min(3, "Category must be at least 3 characters")
    .max(100, "Category must be at most 100 characters"),

// ✅ Prices and discount
sellingPrice: z.union([
  z.number().min(0, "Selling price must be at least 0"),
  z.string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Selling price must be a valid number ≥ 0"
    )
    .transform((val) => Number(val)),
]),


 

  // ✅ Media array
  media: z.array(z.string()),

  // ✅ Description
description: z.string().min(3).max(2000) ,// Example for up to 2000 chars

  // ✅ MRP - accepts number or numeric string
  mrp: z.union([
    z.number().positive("Expect positive value"),
    z
      .string()
      .refine(
        (val) => !isNaN(Number(val)) && Number(val) > 0,
        "Expect positive value"
      )
      .transform((val) => Number(val)),
  ]),


  product: z.string().min(3, "Product is required"),
  sku: z.string().min(3, "SKU is required"),
  color: z.string().min(3, "Color is required"),
  size: z.string().min(1, "Size is required"),

  // ✅ Cupon
  code: z.string().min(3, "Code is required"),


  // minShoppingAmount: stringToNumber.min(0, "Minimum shopping amount must be at least 0"),
  // validity: stringToDate,
  // discountPercent: stringToNumber.min(0, "Discount percent must be at least 0").max(100, "Discount percent must be at most 100"),

 discountPercent: z.union([
  z.number().min(0, "Discount percent must be at least 0").max(100, "Discount percent must be at most 100"),
  z.string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Discount percent must be a valid number ≥ 0"
    )
    .transform((val) => Number(val)),
]),

code: z.string().min(3, "Code is required"),
minShoppingAmount: z.union([
  z.number().min(0, "Minimum shopping amount must be at least 0"),
  z.string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Minimum shopping amount must be a valid number ≥ 0"
    )
    .transform((val) => Number(val)),
]),
validity: z.coerce.date(),

});








