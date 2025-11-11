import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Chip } from "@mui/material"
import userImg from "@/public/assets/images/user.png"
export const DT_CATEGORY_COLUMN= [

    {
        accessorKey: "name",
        header: "Category Name",
    },
    {
        accessorKey: "slug",
        header: "Category Slug",
    },

 
]

export const DT_PRODUCT_COLUMN= [

    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "slug",
        header: "Slug",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "mrp",
        header: "MRP",
    },
    {
        accessorKey: "sellingPrice",
        header: "Selling Price",
    },
    {
        accessorKey: "discountPercent",
        header: "Discount Percent",
    },
    // {
    //     accessorKey: "description",
    //     header: "Description",
    // },
    
 
]
export const DT_PRODUCT_VARIANT_COLUMN = [
  { accessorKey: "product", header: "Product" },
  { accessorKey: "sku", header: "SKU" },
  { accessorKey: "color", header: "Color" },
  { accessorKey: "size", header: "Size" },
  { accessorKey: "mrp", header: "MRP" },
  { accessorKey: "sellingPrice", header: "Selling Price" },
  { accessorKey: "discountPercent", header: "Discount Percent" },
]


export const DT_CUPON_COLUMN = [
    {
        accessorKey: "code",
        header: "Code",
    },
    {
        accessorKey: "discountPercent",
        header: "Discount Percent",
    },
    {
        accessorKey: "minShoppingAmount",
        header: "Min Shopping Amount",
    },
    {
        accessorKey: "validity",
        header: "Validity",
        Cell: ({ renderedCellValue }) => {
            const d = renderedCellValue ? new Date(renderedCellValue) : null;
            const isValid = d && !isNaN(d.getTime());
            if (!isValid) return <Chip color="default" label="No date"/>;
            const expired = Date.now() > d.getTime();
            const dateLabel = d.toLocaleDateString();
            return <Chip color={expired ? "error" : "success"} label={dateLabel} />;
        }
    },
]


export const DT_USER_COLUMN = [

    {

        accessorKey: "avatar",
        header: "Avatar",
        Cell: ({ renderedCellValue }) => {
          return (
            <Avatar>
              <AvatarImage src={renderedCellValue?.url || userImg.src} />
            </Avatar>
          );
        }
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "isEmailVarified",
        header: "Is Varified",
        Cell: ({ renderedCellValue }) => {
            return <Chip color={renderedCellValue ? "success" : "error"} label={renderedCellValue ? "Yes" : "No"} />;
        }
    },
]

export const DT_REVIEW_COLUMN = [
    {
        accessorKey: "product",
        header: "Product",
    },
    {
        accessorKey: "user",
        header: "User",
    },
    {
        accessorKey: "rating",
        header: "Rating",
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "review",
        header: "Review",
    },
]