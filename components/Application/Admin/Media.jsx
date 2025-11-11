import { Checkbox } from '@/components/ui/checkbox'
import { ADMIN_MEDIA_EDIT } from '@/routes/AdminPanelRoute'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FaTrash, FaCopy, FaDownload } from "react-icons/fa"
import { MdModeEdit } from "react-icons/md";
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import Link from 'next/link'
import { showToast } from '@/lib/showToast';
const Media = ({ media, handleDelete, deleteType, selectedMedia, setSelectedMedia }) => {


    const handleCheck = (checked) => {

        let newSelectedMedia = [];

        if(selectedMedia.includes(media._id)){
            newSelectedMedia = selectedMedia.filter(id => id !== media._id)
        } else {
            newSelectedMedia = [...selectedMedia, media._id]
        }

        setSelectedMedia(newSelectedMedia);
    }


    const handleCopyLink = async (url) => {
        await navigator.clipboard.writeText(url);
        showToast('success', 'URL copied to clipboard!');
    }


     // ✅ Async function with URL and filename parameters
    const handleDownload = async (url, filename) => {
        try {
            showToast('info', 'Starting download...');
            
            // Add Cloudinary download flag to force download
            const downloadUrl = url.includes('/upload/')
                ? url.replace('/upload/', `/upload/fl_attachment:${filename}/`)
                : url;
            
            // Open in new tab - browser will automatically download
            window.open(downloadUrl, '_blank');
            
            showToast('success', 'Download started!');
        } catch (error) {
            console.error('Download error:', error);
            showToast('error', 'Download failed');
        }
    }

    return (
        <div className='border 
                        border-gray-200 dark:border-gray-800 
                        relative group rounded overflow-hidden'>

            <div className="absolute top-2 left-2 z-20">
                <Checkbox checked={selectedMedia.includes(media._id)}
                    onCheckedChange={handleCheck}
                    className='border-gray-300 dark:border-gray-600 cursor-pointer'
                />
            </div>

            <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full cursor-pointer"
                        >
                            <IoEllipsisVerticalOutline className='w-5 h-5' />
                        </Button>
                    </DropdownMenuTrigger>


                    <DropdownMenuContent align="end" className="w-48">

                        {deleteType === 'SD' &&
                            <>

                                <DropdownMenuItem asChild className='hover:cursor-pointer'>
                                    <Link href={ADMIN_MEDIA_EDIT(media._id)}> <MdModeEdit /> Edit </Link>
                                </DropdownMenuItem>


                                <DropdownMenuItem onClick={()=>handleCopyLink(media.secure_url)} className='hover:cursor-pointer'>
                                    <FaCopy />
                                    Copy Url
                                </DropdownMenuItem>


                                <DropdownMenuItem onClick={() => handleDownload(media.secure_url, media.filename)} className='hover:cursor-pointer'>
                                    <FaDownload />
                                    Download
                                </DropdownMenuItem>

                            </>
                        }

                        <DropdownMenuItem
                           onClick={() => handleDelete([media._id], deleteType)}

                            className="text-red-600 dark:text-red-400 hover:cursor-pointer"
                        >
                            <FaTrash color='currentColor' />
                            {deleteType === 'SD' ? 'Move to Trash' : 'Delete Permanently'}
                        </DropdownMenuItem>



                    </DropdownMenuContent>
                </DropdownMenu>


            </div>

            <div className='w-full h-full absolute z-10 transition-all duration-150 ease-in group-hover:bg-black/30'>

            </div>



            <div className=''>
                <Image src={media?.secure_url} alt={media.alt || 'Media Image'} height={300} width={300}
                    className='object-cover w-full sm:h-[200px] h-[150px] '
                />
            </div>
        </div>
    )
}

export default Media
