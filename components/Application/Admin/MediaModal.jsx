
import { Button } from '@/components/ui/button'
import loading from '@/public/assets/images/loading.svg'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import React, { useState } from 'react'
import axios from 'axios'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Loading from '@/components/Application/Loading'
import ModalMediaBlock from './ModalMediaBlock'
import { showToast } from '@/lib/showToast'

const MediaModal = ({
    isMultiple,
    open,
    setOpen,
    selectedMedia,
    setSelectedMedia
}) => {

    const [previoslySelectedMedia, setPrevioslySelectedMedia] = useState([])

    // Fetch a single page of media
    const fetchMedia = async (page) => {
        const { data: response } = await axios.get(`/api/media?deleteType=SD&size=18&page=${page}`)
        if (!response.success) throw new Error(response.message || 'Something went wrong')
        return response
    }

    // Infinite media page fetching
    const {
        isPending,
        isError,
        error,
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['MediaModal'],
        queryFn: async ({ pageParam }) => await fetchMedia(pageParam),
        initialPageParam: 0,
        placeholderData: keepPreviousData,
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length
            return lastPage.hasMore ? nextPage : undefined
        }
    })

    //console.log(data);


    const handleClear = () => {
        setSelectedMedia([])
        setPrevioslySelectedMedia([])
    }

    const handleClose = () => {
        setSelectedMedia(previoslySelectedMedia)
        setOpen(false)
        // setSelectedMedia([])
    }
    const handleSelect = () => {
        if (!selectedMedia || selectedMedia.length === 0) {
            showToast('error', 'Please select at least one media')
            return
        }
        setPrevioslySelectedMedia(selectedMedia)
        setOpen(false)
    }


    const handleMediaClick = (media) => {
        setSelectedMedia((prev) => {
            const isSelected = prev.some((m) => m._id === media._id)
            if (isMultiple) {
                return isSelected ? prev.filter((m) => m._id !== media._id) : [...prev, media]
            } else {
                return isSelected ? [] : [media]
            }
        })
    }

    const isSelected = (media) => selectedMedia.some((m) => m._id === media._id)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                className="sm:max-w-[80%] h-[90vh] p-0 bg-white border rounded-lg shadow-lg overflow-hidden flex flex-col"
            >
                <DialogDescription className="hidden" />

                {/* Header */}
                <DialogHeader className="border-b px-5 py-3 bg-gray-50">
                    <DialogTitle className="text-lg font-semibold text-gray-900">
                        Media Selection
                    </DialogTitle>
                </DialogHeader>

                {/* Body */}
                <div className="h-[calc(100%-80px)] overflow-auto py-2 bg-white">
                    {
                        isPending ?
                            (<div className='flex items-center justify-center size-full'>
                                <Image src={loading} height={80} width={80} alt="Loading..." />
                            </div>)
                            :
                            isError ?
                                <div className='flex items-center justify-center size-full'>
                                    <span className='text-red-500 text-sm' >{error.message}</span>
                                </div>
                                :
                                <>
                                    <div className='grid lg:grid-cols-6
                                   grid-cols-3 gap-2'>
                                        {data?.pages?.map((page, index) => (
                                            <React.Fragment key={index}>
                                                {page?.mediaData?.map((media) => (
                                                    <ModalMediaBlock
                                                        key={media._id}
                                                        media={media}
                                                        isSelected={isSelected(media)}
                                                        onClick={() => handleMediaClick(media)}
                                                    />

                                                )

                                                )}

                                            </React.Fragment>
                                        ))}
                                    </div>
                                </>
                    }
                </div>

                {/* Footer */}
                <div className="border-t px-5 py-3 bg-gray-50">
                    <div className="flex flex-nowrap gap-3 justify-end overflow-x-auto">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleClear}
                        >
                            Clear All
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                        >
                            Close
                        </Button>
                        <Button type="button" onClick={handleSelect}>
                            Select
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default MediaModal
