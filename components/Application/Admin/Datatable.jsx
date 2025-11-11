import useDeleteMutation from '@/hooks/useDeleteMutation'
import { DeleteForever, DeleteOutline, Download, RestoreFromTrash } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { MaterialReactTable, MRT_ShowHideColumnsButton, MRT_ToggleDensePaddingButton, MRT_ToggleFullScreenButton, MRT_ToggleGlobalFilterButton, useMaterialReactTable } from 'material-react-table'
import Link from 'next/link'
import React, { useState } from 'react'
import { MdRecycling } from 'react-icons/md'
import ButtonLoading from '../ButtonLoading'
import { catchError } from '@/lib/helperFunction'
import { showToast } from '@/lib/showToast'
import { download, generateCsv, mkConfig } from 'export-to-csv'

const Datatable = (
  { queryKey, fetchUrl, columnsConfig, initialPageSize = 10, exportEndpoint, deleteEndpoint, deleteType, trashView, createAction }) => {

  // filter, sorting , pagiination states
  const [columnFilters, setColumnFilters] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize

  })
  const [exportLoading, setExportLoading] = useState(false)


  const [rowSelection, setRowSelection] = useState({})


  const deleteMutation = useDeleteMutation(queryKey, deleteEndpoint)

  const handleDelete = (ids, deleteType) => {
    let c
    if (deleteType === 'PD') {
      c = confirm('Are you sure you want to permanently delete the selected media?');
    } else {
      c = confirm('Are you sure you want to delete the selected media?');
    }

    if (c) {
      // Perform delete action
  deleteMutation.mutate({ ids, deleteType });

      setRowSelection({})
    }

  }


const handleExport = async (selectedRows) => {
  setExportLoading(true)
  try {
    // ✅ Generate dynamic filename based on page
    const currentDate = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const pageName = queryKey.replace(/-data$/, '') // Extract page name from queryKey
    const typeLabel = deleteType === 'PD' ? 'trash' : 'view'
    const filename = `${pageName}_${typeLabel}_${currentDate}.csv`

    const csvConfig = mkConfig({
      fieldSeparator: ",",
      decimalSeparator: ".",
      showLabels: true,
      filename: filename, // ✅ Dynamic filename
      useKeysAsHeaders: true
    })

    let csv

    if (Object.keys(rowSelection).length > 0) {
      const rowData = selectedRows.map((row) => row.original)
      csv = generateCsv(csvConfig)(rowData)
    } else {
      const { data: response } = await axios.get(exportEndpoint)
      if (!response.success) {
        throw new Error(response.message)
      }
      const rowData = response.data
      csv = generateCsv(csvConfig)(rowData)
    }
    download(csvConfig)(csv)

  } catch (error) {
    catchError(error)
    showToast('error', error.message)
  } finally {
    setExportLoading(false)
  }
}


  // data fetching logics

  const {
    data: { data = [], meta } = {},

    isLoading,
    isRefetching,
    isError,

  } = useQuery({
    queryKey: [queryKey, { columnFilters, globalFilter, sorting, pagination }],
    queryFn: async () => {
      const url = new URL(fetchUrl, process.env.NEXT_PUBLIC_BASE_URL)
      url.searchParams.set('start', pagination.pageIndex * pagination.pageSize)
      url.searchParams.set('size', `${pagination.pageSize}`);
      url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
      url.searchParams.set('globalFilter', globalFilter ?? '');
      url.searchParams.set('sorting', JSON.stringify(sorting ?? []));
      url.searchParams.set('deleteType', deleteType)

      const { data: response } = await axios.get(url.href);
      return response;
      
    },

    placeholderData: keepPreviousData

  })



  //init table

 const table = useMaterialReactTable({
    columns: columnsConfig,
    data,
    

     // ✅ Enable resizing and dragging
    // enableColumnResizing: true,
    // columnResizeMode: 'onChange', // or 'onEnd'
    // enableColumnDragging: true,
  

    
    enableColumnOrdering: true,
  

    enableRowSelection: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    enableStickyHeader: true,
    enableStickyFooter: true,
    initialState: {
      showColumnFilters: true,
    },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: isError ? {
      children: 'Error fetching data',
      color: 'error',
    } : undefined,

    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,

    rowCount: meta?.totalRowCount ?? 0,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      globalFilter,
      pagination,
      sorting,
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      rowSelection
    },

    getRowId: (originalRow) => originalRow._id,
    renderToolbarInternalActions: ({ table }) => (
      <>
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />

        {deleteType !== 'PD' && (
          <Tooltip title="Recycle bin">
            <Link href={trashView}>
              <IconButton>
                <MdRecycling />
              </IconButton>
            </Link>
          </Tooltip>
        )}

        {deleteType === 'SD' && (
          <Tooltip title="Delete All">
            <IconButton 
              disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} 
              onClick={() => handleDelete(Object.keys(rowSelection), deleteType)}
            >
              <DeleteOutline />
            </IconButton>
          </Tooltip>
        )}

        {deleteType === 'PD' && (
          <>
            <Tooltip title='Restore Data'>
              <IconButton 
                disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} 
                onClick={() => handleDelete(Object.keys(rowSelection), "RSD")}
              >
                <RestoreFromTrash />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete Permanently'>
              <IconButton 
                disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} 
                onClick={() => handleDelete(Object.keys(rowSelection), deleteType)}
              >
                <DeleteForever />
              </IconButton>
            </Tooltip>
          </>
        )}
      </>
    ),

    enableRowActions: true,
    positionActionsColumn: 'last',
    // ✅ Use renderRowActionMenuItems for dropdown menu
    renderRowActionMenuItems: ({ row }) => createAction(row, deleteType, handleDelete),

    renderTopToolbarCustomActions: ({ table }) => (
      <Tooltip title="Export to CSV">
        <ButtonLoading 
          type='button' 
          text={<><Download  fontSize='30'/> Export</>} 
          loading={exportLoading}
          onClick={() => handleExport(table.getSelectedRowModel().rows)} 
        />
      </Tooltip>
    )
})

  return (

<MaterialReactTable table={table}/>
  )
}

export default Datatable
