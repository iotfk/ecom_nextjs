'use client'
import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FaRegStar, FaStar } from "react-icons/fa";
const RecentReview = () => {
  const [reviews, setReviews] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let ignore = false
    const load = async () => {
      try {
        const res = await fetch('/api/review?start=0&size=10', { cache: 'no-store' })
        if (!res.ok) {
          setReviews([])
          return
        }
        const json = await res.json()
        if (!ignore) setReviews(Array.isArray(json?.data) ? json.data : [])
      } catch (_) {
        setReviews([])
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead className='text-right'>Rating</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(loading ? Array.from({ length: 5 }) : reviews).map((item, idx) => {
          const name = item?.product || 'Product'
          const rating = Number(item?.rating) || 0
          return (
            <TableRow key={item?._id || idx}>
              <TableCell>
                <div className='flex items-center gap-2 whitespace-nowrap'>
                  <Avatar>
                    <AvatarImage src={imgPlaceholder.src} alt="product" />
                  </Avatar>
                  <span>{name}</span>
                </div>
              </TableCell>
              <TableCell className='text-right'>
                <div className='flex items-center gap-1 justify-end'>
                  {[0,1,2,3,4].map(i => (
                    i < Math.round(rating) ? <FaStar key={i} /> : <FaRegStar key={i} />
                  ))}
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default RecentReview