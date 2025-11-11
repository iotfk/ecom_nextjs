'use client'
import ButtonLoading from '@/components/Application/ButtonLoading'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import {  ADMIN_DASHBOARD, ADMIN_PRODUCT_ADD, ADMIN_PRODUCT_SHOW } from '@/routes/AdminPanelRoute'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FaPlus } from 'react-icons/fa6'
import DatatableWrapper from '@/components/Application/Admin/DatatableWrapper'
import { useCallback, useMemo } from 'react'
import { columnConfig } from '@/lib/helperFunction'
import { DT_PRODUCT_COLUMN } from '@/lib/column'
import EditAction from '@/components/Application/Admin/EditAction'
import { ADMIN_PRODUCT_EDIT } from '@/routes/AdminPanelRoute'
import { ADMIN_TRASH } from '@/routes/AdminPanelRoute'
import DeleteAction from '@/components/Application/Admin/DeleteAction'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_PRODUCT_SHOW, label: 'Product' },
 
]


const showProduct = () => {


  const columns = useMemo(()=>{
    return columnConfig(DT_PRODUCT_COLUMN)
  },[])

const action = useCallback((row, deleteType, handleDelete) => {
  let actionMenu = []
  actionMenu.push(<EditAction key="edit" href={ADMIN_PRODUCT_EDIT(row.original._id)} />)
  actionMenu.push(<DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType} />)
  return actionMenu
}, [])


  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 rounded shadow-sm gap-0">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl">View Product</h4>
            <Button>
              <FaPlus />
              <Link href={ADMIN_PRODUCT_ADD} > New Product</Link>
            </Button>

          </div>



        </CardHeader>

        <CardContent className="px-0 pt-0">
             <DatatableWrapper
             queryKey="product-data"
             fetchUrl="/api/product"
             initialPageSize={10}
             exportEndpoint="/api/product/export"
             deleteEndpoint="/api/product/delete"
             deleteType="SD"
             trashView={`${ADMIN_TRASH}?trashof=product`}
             createAction={action}
            columnsConfig={columns}
             />
        </CardContent>
      </Card>
    </div>
  )
}

export default showProduct
