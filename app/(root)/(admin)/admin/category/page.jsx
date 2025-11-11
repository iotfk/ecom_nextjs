'use client'
import ButtonLoading from '@/components/Application/ButtonLoading'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { ADMIN_CATEGORY_ADD, ADMIN_DASHBOARD, ADMIN_CATEGORY_SHOW } from '@/routes/AdminPanelRoute'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FaPlus } from 'react-icons/fa6'
import DatatableWrapper from '@/components/Application/Admin/DatatableWrapper'
import { useCallback, useMemo } from 'react'
import { columnConfig } from '@/lib/helperFunction'
import { DT_CATEGORY_COLUMN } from '@/lib/column'
import EditAction from '@/components/Application/Admin/EditAction'
import { ADMIN_CATEGORY_EDIT } from '@/routes/AdminPanelRoute'
import { ADMIN_TRASH } from '@/routes/AdminPanelRoute'
import DeleteAction from '@/components/Application/Admin/DeleteAction'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_CATEGORY_SHOW, label: 'Category' },
 
]


const showCategory = () => {


  const columns = useMemo(()=>{
    return columnConfig(DT_CATEGORY_COLUMN)
  },[])

const action = useCallback((row, deleteType, handleDelete) => {
  let actionMenu = []
  actionMenu.push(<EditAction key="edit" href={ADMIN_CATEGORY_EDIT(row.original._id)} />)
  actionMenu.push(<DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType} />)
  return actionMenu
}, [])


  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 rounded shadow-sm gap-0">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl">View Category</h4>
            <Button>
              <FaPlus />
              <Link href={ADMIN_CATEGORY_ADD} >View Category</Link>
            </Button>

          </div>



        </CardHeader>

        <CardContent className="px-0 pt-0">
             <DatatableWrapper
             queryKey="category-data"
             fetchUrl="/api/category"
             initialPageSize={10}
             exportEndpoint="/api/category/export"
             deleteEndpoint="/api/category/delete"
             deleteType="SD"
             trashView={`${ADMIN_TRASH}?trashof=category`}
             createAction={action}
            columnsConfig={columns}
             />
        </CardContent>
      </Card>
    </div>
  )
}

export default showCategory
