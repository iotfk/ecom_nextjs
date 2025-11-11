'use client'
import React from 'react'
import Image from 'next/image'
import loading from '@/public/assets/images/loading.svg'

const Loading = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-white">
      <Image src={loading} height={80} width={80} alt="Loading..." />
    </div>
  )
}

export default Loading
