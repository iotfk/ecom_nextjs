import {
    ADMIN_CATEGORY_ADD,
    ADMIN_DASHBOARD,
    ADMIN_MEDIA_SHOW,
    ADMIN_CATEGORY_SHOW,
    ADMIN_PRODUCT_ADD,
    ADMIN_PRODUCT_SHOW,
    ADMIN_PRODUCT_VARIANT_ADD,
    ADMIN_PRODUCT_VARIANT_SHOW,
    ADMIN_USERS_SHOW,
    ADMIN_REVIEW_SHOW
} from "@/routes/AdminPanelRoute";

// Admin Sidebar icons.
import { AiOutlineDashboard } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import { LuUserRound } from "react-icons/lu";
import { IoMdStarOutline } from "react-icons/io";
import { MdOutlinePermMedia } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import { ADMIN_CUPON_ADD, ADMIN_CUPON_SHOW } from "@/routes/AdminPanelRoute";

export const adminSidebarmenu = [
    {
        title: "Dashboard",
        url: ADMIN_DASHBOARD,
        icon: AiOutlineDashboard
    },

    {
        title: "Category",
        url: "#",
        icon: BiCategory,

        submenu: [
            {
                title: "Add Category",
                url: ADMIN_CATEGORY_ADD,
            },
            {
                title: "All Category",
                url: ADMIN_CATEGORY_SHOW,
            }
        ]

    },

    {
        title: "Product",
        url: "#",
        icon: IoShirtOutline,

        submenu: [
            {
                title: "Add Product",
                url: ADMIN_PRODUCT_ADD,
            },
            {
                title: "Add Varient",
                url: ADMIN_PRODUCT_VARIANT_ADD,
            },
            {
                title: "All Product",
                url: ADMIN_PRODUCT_SHOW,
            },
            {
                title: "Product Varient",
                url: ADMIN_PRODUCT_VARIANT_SHOW,
            }
        ]

    },



    {
        title: "Cupons",
        url: "#",
        icon: RiCoupon2Line,

        submenu: [
            {
                title: "Add Cupons",
                url: ADMIN_CUPON_ADD,
            },
            {
                title: "All Cupons",
                url: ADMIN_CUPON_SHOW,
            },
        ]

    },



    {
        title: "Orders",
        url: "#",
        icon: MdOutlineShoppingBag,

    },

    {
        title: "Customers",
        url: ADMIN_USERS_SHOW,
        icon: LuUserRound,

    },

    {
        title: "Rating & Review",
        url: ADMIN_REVIEW_SHOW,
        icon: IoMdStarOutline,

    },

    {
        title: "Media",
        url: ADMIN_MEDIA_SHOW,
        icon: MdOutlinePermMedia,

    },
]