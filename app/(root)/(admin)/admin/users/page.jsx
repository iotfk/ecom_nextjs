'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import {  
   ADMIN_DASHBOARD, 
   ADMIN_TRASH,
   ADMIN_USERS_SHOW} 
   from '@/routes/AdminPanelRoute'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import DatatableWrapper from '@/components/Application/Admin/DatatableWrapper'
import { useCallback, useMemo } from 'react'
import { columnConfig } from '@/lib/helperFunction'
import {  DT_USER_COLUMN } from '@/lib/column'
import DeleteAction from '@/components/Application/Admin/DeleteAction'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_USERS_SHOW, label: 'Users' },
]

const showCustomers = () => {
  const columns = useMemo(()=>{
    return columnConfig(DT_USER_COLUMN)
  },[])

const action = useCallback((row, deleteType, handleDelete) => {
  let actionMenu = []
  // actionMenu.push(<EditAction key="edit" href={ADMIN_CUPON_EDIT(row.original._id)} />)
  actionMenu.push(<DeleteAction key="delete"
     handleDelete={handleDelete} row={row}
      deleteType={deleteType} />)
  return actionMenu
}, [])


  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 rounded shadow-sm gap-0">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl">View Users</h4>

          </div>



        </CardHeader>

        <CardContent className="px-0 pt-0">
             <DatatableWrapper
             queryKey="user-data"
             fetchUrl="/api/users"
             initialPageSize={10}
             exportEndpoint="/api/users/export"
             deleteEndpoint="/api/users/delete"
             deleteType="SD"
             trashView={`${ADMIN_TRASH}?trashof=user`}
             createAction={action}
            columnsConfig={columns}
             />
        </CardContent>
      </Card>
    </div>
  )
}

export default showCustomers
