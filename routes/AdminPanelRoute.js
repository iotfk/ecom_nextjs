//AdminPanelRoute.js
export const ADMIN_DASHBOARD = '/admin/dashboard'

// Media Route
export const ADMIN_MEDIA_SHOW = "/admin/media"
export const ADMIN_MEDIA_EDIT = (id) => id? `/admin/media/edit/${id}` : ""

// Category Route
export const ADMIN_CATEGORY_SHOW = "/admin/category"
export const ADMIN_CATEGORY_ADD = "/admin/category/add"
export const ADMIN_CATEGORY_EDIT = (id) => id? `/admin/category/edit/${id}` : ""

// Trash Route
export const ADMIN_TRASH = "/admin/trash"


// Product Route
export const ADMIN_PRODUCT_SHOW = "/admin/product"
export const ADMIN_PRODUCT_ADD = "/admin/product/add"
export const ADMIN_PRODUCT_EDIT = (id) => id? `/admin/product/edit/${id}` : ""

// product-variant Route
export const ADMIN_PRODUCT_VARIANT_SHOW = "/admin/product-variant"
export const ADMIN_PRODUCT_VARIANT_ADD = "/admin/product-variant/add"
export const ADMIN_PRODUCT_VARIANT_EDIT = (id) => id? `/admin/product-variant/edit/${id}` : ""

// cupon route
export const ADMIN_CUPON_SHOW = "/admin/cupon"
export const ADMIN_CUPON_ADD = "/admin/cupon/add"
export const ADMIN_CUPON_EDIT = (id) => id? `/admin/cupon/edit/${id}` : ""

// customers route
export const ADMIN_USERS_SHOW = "/admin/users"

// review route
export const ADMIN_REVIEW_SHOW = "/admin/review"

// order route
export const ADMIN_ORDERS_SHOW = "/admin/order"
export const ADMIN_ORDERS_ADD = "/admin/order/add"
export const ADMIN_ORDERS_EDIT = (id) => id? `/admin/order/edit/${id}` : ""
