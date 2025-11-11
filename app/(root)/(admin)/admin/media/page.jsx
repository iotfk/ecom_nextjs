'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import UploadMedia from '@/components/Application/Admin/UploadMedia'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from '@/routes/AdminPanelRoute'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaCopy, FaTrash } from 'react-icons/fa'
import { showToast } from '@/lib/showToast'
import Media from '@/components/Application/Admin/Media'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import useDeleteMutation from '@/hooks/useDeleteMutation'
import ButtonLoading from '@/components/Application/ButtonLoading'
const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: '', label: 'Media' }
]

const MediaPage = () => {

  const [deleteType, setDeleteType] = useState('SD');
  const [selectedMedia, setSelectedMedia] = useState([]);
  const searchParams = useSearchParams();
  const [selectAll, setSelectAll] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (searchParams) {
      const trashof = searchParams.get('trashof');
      setSelectedMedia([]);
      if (trashof) {
        setDeleteType('PD');
      } else {
        setDeleteType('SD');
      }
    }
  }, [searchParams]);


  const fetchMedia = async ({ pageParam = 0 }) => {
    const { data } = await axios.get(
      `/api/media?page=${pageParam}&limit=10&deleteType=${deleteType}`
    );
    return data;
  }

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['media-data', deleteType],
    queryFn: fetchMedia,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length : undefined;
    }
  })

  const handleUploadComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['media-data'] });
  }


  const deleteMutation = useDeleteMutation('media-data', '/api/media/delete');


  const handleDelete = (selectedMedia, deleteType) => {

    let c = true
    if (deleteType === 'PD') {
      c = confirm('Are you sure you want to permanently delete the selected media?');
    }

    if (c) {
      // Perform delete action
      deleteMutation.mutate({ ids: selectedMedia, deleteType });

    }
    setSelectAll(false);
    setSelectedMedia([]);
  }

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  }

  useEffect(() => {
    if (selectAll) {
      const ids = data?.pages?.flatMap(page => page.mediaData.map(media => media._id)) || [];
      setSelectedMedia(ids);
    } else {
      setSelectedMedia([]);
    }
  }, [selectAll])

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className='py-0 rounded shadow-sm'>
        {/* border-b [.border-b]:pb-2 pt-3 px-3 */}
        <CardHeader className='border-b [.border-b]:pb-2 pt-3 px-3'>
          <div className='flex justify-between items-center'>
            <h4 className='font-semibold text-xl uppercase'>
              {deleteType === 'SD' ? 'Media Library' : 'Trash Bin'}

            </h4>
            <div className='flex items-center gap-5 cursor-pointer'>
              {deleteType == 'SD' && <UploadMedia className='cursor-pointer' queryClient={queryClient} isMultiple={true} onUploadComplete={handleUploadComplete} />}

              <div className="flex gap-3">
                {deleteType === 'SD'

                  ?

                  <Button variant='destructive' size="sm" className=''>
                    <Link href={`${ADMIN_MEDIA_SHOW}?trashof=media`}>Trash</Link>
                  </Button>

                  :

                  <Button size="sm" >
                    <Link href={`${ADMIN_MEDIA_SHOW}`}>Back To Media</Link>
                  </Button>

                }
              </div>

            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">

          {selectedMedia.length > 0 &&
            <div className='py-2 px-3 bg-violet-400 mb-2 rounded flex items-center justify-between'>

              <div className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  id="select-all"
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                  className='border-primary cursor-pointer '
                />
                <Label
                  htmlFor="select-all"
                  className="text-white font-medium cursor-pointer text-sm select-none"
                >
                  {selectAll ? 'Deselect all' : `${selectedMedia.length} selected`}
                </Label>
              </div>



<div className="flex gap-2">
  {deleteType === 'SD' ?
    <Button 
      className='bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-sm transition-all duration-200 cursor-pointer' 
      size="sm"
      onClick={() => handleDelete(selectedMedia, deleteType)}
    >
      Move to Trash
    </Button>
    :
    <>
      <Button 
        className='cursor-pointer bg-green-500 hover:bg-green-600 active:bg-green-700 text-white shadow-sm transition-all duration-200'
        size="sm"
        onClick={() => handleDelete(selectedMedia, 'RSD')}
      >
        Restore
      </Button>

      <Button 
        className='cursor-pointer bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-sm transition-all duration-200'
        size="sm"
        onClick={() => handleDelete(selectedMedia, deleteType)}
      >
        Delete Permanently
      </Button>
    </>
  }
</div>



            </div>

          }

          {status === 'pending' ? (
            <div className="text-center py-8">
              <p>Loading media...</p>
            </div>
          ) : status === 'error' ? (
            <div className="text-center py-8 text-red-500 text-sm">
              <p>Error: {error.message}</p>
            </div>
          ) : (
            <>

              <div className='grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-3 mb-5'>
                {data?.pages?.map((page, pageIndex) => (
                  <React.Fragment key={pageIndex}>
                    {page?.mediaData?.map((media) => (
                      <Media key={media._id}
                        media={media}
                        handleDelete={handleDelete}
                        deleteType={deleteType}
                        selectedMedia={selectedMedia}
                        setSelectedMedia={setSelectedMedia}
                      />

                    ))}
                  </React.Fragment>
                ))}
              </div>

              {/* Empty state */}
              {data?.pages?.[0]?.mediaData?.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">


                  {/* Empty state - Conditional messages */}
                  {data?.pages?.[0]?.mediaData?.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      {deleteType === 'SD' ? (
                        <p>No media found. Upload some images to get started.</p>
                      ) : (
                        <p>Trash is empty. No deleted items found.</p>
                      )}
                    </div>
                  )}



                </div>
              )}


            </>
          )}

          {hasNextPage && (
            <div className="">
              <ButtonLoading type='button' loading={isFetchingNextPage} text='Load More' onClick={() => fetchNextPage()} />
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}

export default MediaPage
