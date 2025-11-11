'use client'
import ButtonLoading from '@/components/Application/ButtonLoading'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import DatatableWrapper from '@/components/Application/Admin/DatatableWrapper'
import { useCallback, useMemo } from 'react'
import { columnConfig } from '@/lib/helperFunction'

import { 
  DT_CATEGORY_COLUMN, 
  DT_PRODUCT_COLUMN, 
  DT_PRODUCT_VARIANT_COLUMN,
   DT_CUPON_COLUMN, 
   DT_USER_COLUMN, 
   DT_REVIEW_COLUMN } from '@/lib/column'

import { ADMIN_TRASH } from '@/routes/AdminPanelRoute'
import DeleteAction from '@/components/Application/Admin/DeleteAction'
import { useSearchParams } from 'next/navigation'


const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_TRASH, label: 'Trash' },
]


const TRASH_CONFIG = {
  category: {
    title: 'Category Trash',
    columns: DT_CATEGORY_COLUMN,
    fetchUrl: '/api/category',
    exportUrl: '/api/category/export',
    deleteUrl: '/api/category/delete'
  },
  product: {
    title: 'Product Trash',
    columns: DT_PRODUCT_COLUMN,
    fetchUrl: '/api/product',
    exportUrl: '/api/product/export',
    deleteUrl: '/api/product/delete'
  },

  "product-variant": {
    title: 'Product Variant Trash',
    columns: DT_PRODUCT_VARIANT_COLUMN,
    fetchUrl: '/api/product-variant',
    exportUrl: '/api/product-variant/export',
    deleteUrl: '/api/product-variant/delete'
  },

  cupon: {
    title: 'Cupon Trash',
    columns: DT_CUPON_COLUMN,
    fetchUrl: '/api/cupon',
    exportUrl: '/api/cupon/export',
    deleteUrl: '/api/cupon/delete'
  },

  user: {
    title: 'User Trash',
    columns: DT_USER_COLUMN,
    fetchUrl: '/api/users',
    exportUrl: '/api/users/export',
    deleteUrl: '/api/users/delete'
  },

  review: {
    title: 'Review Trash',
    columns: DT_REVIEW_COLUMN,
    fetchUrl: '/api/review',
    exportUrl: '/api/review/export',
    deleteUrl: '/api/review/delete'
  },

}

const Trash = () => {
  const searchParams = useSearchParams()
  const trashOf = searchParams.get('trashof')

  const config = TRASH_CONFIG[trashOf]
  const columns = useMemo(() => {
    return columnConfig(config.columns, false, false, true)
  }, [])

  const action = useCallback((row, deleteType, handleDelete) => {
    return [<DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType} />]
  }, [])


  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 rounded shadow-sm gap-0">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl">{config.title}</h4>
          </div>
        </CardHeader>

        <CardContent className="px-0 pt-0">
          <DatatableWrapper
            queryKey={`${trashOf}-data-deleted`}
            fetchUrl={config.fetchUrl}
            initialPageSize={10}
            exportEndpoint={config.exportUrl}
            deleteEndpoint={config.deleteUrl}
            deleteType="PD"
            trashView={`${ADMIN_TRASH}?trashof=category`}
            createAction={action}
            columnsConfig={columns}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default Trash
