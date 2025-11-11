'use client'
import useFetch from '@/hooks/useFetch'
import {
    ADMIN_CATEGORY_SHOW,
    ADMIN_PRODUCT_SHOW,
    ADMIN_USERS_SHOW,
    ADMIN_ORDERS_SHOW
}
    from '@/routes/AdminPanelRoute'
import Link from 'next/link'
import React from 'react'
import { BiCategory } from 'react-icons/bi'
import { IoShirtOutline } from 'react-icons/io5'
import { LuUserRound } from 'react-icons/lu'
import { MdOutlineShoppingBag } from 'react-icons/md'

const CountOverview = () => {

    const { data: countData } = useFetch('/api/dashboard/admin/count')


    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 sm:gap-10 gap-5'>
            <Link href={ADMIN_CATEGORY_SHOW}>
                <div className='group relative overflow-hidden border shadow 
                        border-l-4 border-l-green-400
                        flex items-center justify-between 
                        p-3 rounded-lg bg-white dark:bg-card
                        dark:border-gray-800 dark:border-l-green-400
                        transform-gpu transition-all duration-300 ease-out hover:scale-[1.04] hover:-rotate-[0.5deg] hover:shadow-2xl'>
                    <span className='pointer-events-none absolute -inset-12 -z-10 rounded-full opacity-0 group-hover:opacity-60 blur-2xl 
                    bg-[conic-gradient(at_center,_#22c55e_0%,_#34d399_25%,_#06b6d4_50%,_#34d399_75%,_#22c55e_100%)] 
                    motion-safe:group-hover:animate-[spin_12s_linear_infinite_alternate]'></span>
                    <div className='relative z-10'>
                        <h4 className='font-medium dark:text-white transition-colors duration-500 ease-in-out '>Total Category</h4>
                        <span className='text-xl font-semibold dark:text-white transition-colors duration-500 ease-in-out '> {countData?.data?.category || 0} </span>
                    </div>
                    <div className='relative z-10'>

                        <span
                            className='text-white bg-green-500 w-12 h-12 border rounded-full flex items-center justify-center
             transition-colors duration-500 ease-in-out
             transform transition-transform duration-300
             drop-shadow-none group-hover:drop-shadow-xl
             group-hover:-translate-y-1
             group-hover:bg-white group-hover:text-green-600'
                        >
                            <BiCategory />
                        </span>

                    </div>
                </div>
            </Link>


            <Link href={ADMIN_PRODUCT_SHOW}>
                <div className='group relative overflow-hidden border shadow 
                        border-l-4 border-l-blue-400
                        flex items-center justify-between 
                        p-3 rounded-lg bg-white dark:bg-card
                        dark:border-gray-800 dark:border-l-blue-400
                        transform-gpu transition-all duration-300 ease-out hover:scale-[1.04] hover:rotate-[0.5deg] hover:shadow-2xl'>
                    <span className='pointer-events-none absolute -inset-12 -z-10 rounded-full opacity-0 group-hover:opacity-60 blur-2xl 
                    bg-[conic-gradient(at_center,_#3b82f6_0%,_#06b6d4_25%,_#a78bfa_50%,_#06b6d4_75%,_#3b82f6_100%)] 
                    motion-safe:group-hover:animate-[spin_12s_linear_infinite_alternate]'></span>
                    <div className='relative z-10'>
                        <h4 className='font-medium dark:text-white transition-colors duration-500 ease-in-out '>Total Product</h4>
                        <span className='text-xl font-semibold dark:text-white transition-colors duration-500 ease-in-out '> {countData?.data?.product || 0} </span>
                    </div>
                    <div className='relative z-10'>
                        <span
                            className='text-white bg-blue-500 w-12 h-12 border rounded-full flex items-center justify-center
             transition-colors duration-500 ease-in-out transform transition-transform duration-300 drop-shadow-none group-hover:drop-shadow-xl group-hover:-translate-y-1 group-hover:bg-white group-hover:text-blue-600'
                        >
                            <IoShirtOutline />
                        </span>

                    </div>
                </div>
            </Link>




            <Link href={ADMIN_USERS_SHOW}>
                <div className='group relative overflow-hidden border shadow 
                        border-l-4 border-l-yellow-400
                        flex items-center justify-between 
                        p-3 rounded-lg bg-white dark:bg-card
                        dark:border-gray-800 dark:border-l-yellow-400
                        transform-gpu transition-all duration-300 ease-out hover:scale-[1.04] hover:-rotate-[0.5deg] hover:shadow-2xl'>
                    <span className='pointer-events-none absolute -inset-12 -z-10 rounded-full opacity-0 group-hover:opacity-60 blur-2xl 
                    bg-[conic-gradient(at_center,_#f59e0b_0%,_#f97316_25%,_#fde047_50%,_#f97316_75%,_#f59e0b_100%)] 
                    motion-safe:group-hover:animate-[spin_12s_linear_infinite_alternate]'></span>
                    <div className='relative z-10'>
                        <h4 className='font-medium dark:text-white transition-colors duration-500 ease-in-out '>Total Customers</h4>
                        <span className='text-xl font-semibold dark:text-white transition-colors duration-500 ease-in-out '> {countData?.data?.customer || 0} </span>
                    </div>
                    <div className='relative z-10'>
                        <span className='text-white bg-yellow-500 w-12 h-12 border rounded-full flex items-center justify-center transition-colors duration-500 ease-in-out transform transition-transform duration-300 drop-shadow-none group-hover:drop-shadow-xl group-hover:-translate-y-1 group-hover:bg-white group-hover:text-yellow-600'>
                            <LuUserRound />
                        </span>
                    </div>
                </div>
            </Link>




            <Link href={ADMIN_ORDERS_SHOW}>
                <div className='group relative overflow-hidden border shadow 
                        border-l-4 border-l-cyan-400
                        flex items-center justify-between 
                        p-3 rounded-lg bg-white dark:bg-card
                        dark:border-gray-800 dark:border-l-cyan-400
                        transform-gpu transition-all duration-300 ease-out hover:scale-[1.04] hover:rotate-[0.5deg] hover:shadow-2xl'>
                    <span className='pointer-events-none absolute -inset-12 -z-10 rounded-full opacity-0 group-hover:opacity-60 blur-2xl 
                    bg-[conic-gradient(at_center,_#06b6d4_0%,_#22d3ee_25%,_#14b8a6_50%,_#22d3ee_75%,_#06b6d4_100%)] 
                    motion-safe:group-hover:animate-[spin_12s_linear_infinite_alternate]'></span>
                    <div className='relative z-10'>
                        <h4 className='font-medium dark:text-white transition-colors duration-500 ease-in-out '>Total Orders</h4>
                        <span className='text-xl font-semibold dark:text-white transition-colors duration-500 ease-in-out '> {countData?.data?.order || 0} </span>
                    </div>
                    <div className='relative z-10'>
                        <span className='text-white bg-cyan-500 w-12 h-12 border rounded-full flex items-center justify-center transition-colors duration-500 ease-in-out transform transition-transform duration-300 drop-shadow-none group-hover:drop-shadow-xl group-hover:-translate-y-1 group-hover:bg-white group-hover:text-cyan-600'>
                            <MdOutlineShoppingBag />
                        </span>
                    </div>
                </div>
            </Link>


        </div>
    )
}

export default CountOverview