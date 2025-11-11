import { ADMIN_CATEGORY_ADD, ADMIN_CUPON_ADD, ADMIN_MEDIA_SHOW, ADMIN_PRODUCT_ADD } from '@/routes/AdminPanelRoute'
import Link from 'next/link'
import { BiCategory } from 'react-icons/bi'
import { IoShirtOutline } from 'react-icons/io5'
import { LuUserRound } from 'react-icons/lu'
import { MdOutlinePermMedia, MdOutlineShoppingBag } from 'react-icons/md'
import { RiCoupon2Line } from 'react-icons/ri'

const QuickAdd = () => {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-10 gap-5 mt-10'>
            <Link href={ADMIN_CATEGORY_ADD}>
                <div className='group relative overflow-hidden flex items-center justify-between p-3
            rounded-lg shadow bg-white dark:bg-card
             bg-gradient-to-tr from-green-400 via-green-500 to-green-600
             transform-gpu transition-all duration-300 ease-out hover:scale-[1.04] hover:-rotate-[0.5deg] hover:shadow-2xl
             ring-0 group-hover:ring-2 ring-white/30'>
                    <span className='pointer-events-none absolute -inset-12 -z-10 opacity-0 group-hover:opacity-100 blur-2xl 
                    bg-[conic-gradient(at_center,_#22c55e_0%,_#34d399_25%,_#06b6d4_50%,_#34d399_75%,_#22c55e_100%)] 
                    motion-safe:group-hover:animate-[spin_12s_linear_infinite_alternate]'></span>
                    <span className='pointer-events-none absolute inset-0 -z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-500 
                    bg-[radial-gradient(120%_60%_at_0%_0%,rgba(255,255,255,0.35),transparent_60%),radial-gradient(120%_60%_at_100%_100%,rgba(255,255,255,0.25),transparent_60%)] mix-blend-soft-light'></span>
                    <span className='pointer-events-none absolute top-1/2 left-[-30%] -z-10 h-[140%] w-[30%] -translate-x-full -translate-y-1/2 rotate-[25deg] 
                    bg-white/30 blur-md opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[350%] group-hover:opacity-40'></span>
                    <h4 className='font-medium text-white dark:text-black'>Add Category</h4>
                    <span className='rounded-full text-white w-12 h-12 border dark:border-green-800 flex items-center justify-center transform transition-transform duration-300 group-hover:-translate-y-1 drop-shadow-none group-hover:drop-shadow-xl'><BiCategory size={20} /></span>
                </div>
            </Link>


            <Link href={ADMIN_PRODUCT_ADD}>
                <div className='group relative overflow-hidden flex items-center justify-between p-3
            rounded-lg shadow bg-white dark:bg-card
             bg-gradient-to-tr from-blue-400 via-blue-500 to-blue-600
             transform-gpu transition-all duration-300 ease-out hover:scale-[1.04] hover:rotate-[0.5deg] hover:shadow-2xl
             ring-0 group-hover:ring-2 ring-white/30'>
                    <span className='pointer-events-none absolute -inset-12 -z-10 opacity-0 group-hover:opacity-50 blur-2xl 
                    bg-[conic-gradient(at_center,_#3b82f6_0%,_#06b6d4_25%,_#a78bfa_50%,_#06b6d4_75%,_#3b82f6_100%)] 
                    motion-safe:group-hover:animate-[spin_12s_linear_infinite_alternate]'></span>
                    <span className='pointer-events-none absolute inset-0 -z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-500 
                    bg-[radial-gradient(120%_60%_at_0%_0%,rgba(255,255,255,0.35),transparent_60%),radial-gradient(120%_60%_at_100%_100%,rgba(255,255,255,0.25),transparent_60%)] mix-blend-soft-light'></span>
                    <span className='pointer-events-none absolute top-1/2 left-[-30%] -z-10 h-[140%] w-[30%] -translate-x-full -translate-y-1/2 rotate-[25deg] 
                    bg-white/30 blur-md opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[350%] group-hover:opacity-40'></span>
                    <h4 className='font-medium text-white dark:text-black'>Add Product</h4>
                    <span className='rounded-full text-white w-12 h-12 border dark:border-blue-800 flex items-center justify-center transform transition-transform duration-300 group-hover:-translate-y-1 drop-shadow-none group-hover:drop-shadow-xl'><BiCategory size={20} /></span>
                </div>
            </Link>


            <Link href={ADMIN_CUPON_ADD}>
                <div className='group relative overflow-hidden flex items-center justify-between p-3
            rounded-lg shadow bg-white dark:bg-card
             bg-gradient-to-tr from-yellow-400 via-yellow-500 to-yellow-600
             transform-gpu transition-all duration-300 ease-out hover:scale-[1.04] hover:-rotate-[0.5deg] hover:shadow-2xl
             ring-0 group-hover:ring-2 ring-white/30'>
                    <span className='pointer-events-none absolute -inset-12 -z-10 opacity-0 group-hover:opacity-50 blur-2xl 
                    bg-[conic-gradient(at_center,_#f59e0b_0%,_#f97316_25%,_#fde047_50%,_#f97316_75%,_#f59e0b_100%)] 
                    motion-safe:group-hover:animate-[spin_12s_linear_infinite_alternate]'></span>
                    <span className='pointer-events-none absolute inset-0 -z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-500 
                    bg-[radial-gradient(120%_60%_at_0%_0%,rgba(255,255,255,0.35),transparent_60%),radial-gradient(120%_60%_at_100%_100%,rgba(255,255,255,0.25),transparent_60%)] mix-blend-soft-light'></span>
                    <span className='pointer-events-none absolute top-1/2 left-[-30%] -z-10 h-[140%] w-[30%] -translate-x-full -translate-y-1/2 rotate-[25deg] 
                    bg-white/30 blur-md opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[350%] group-hover:opacity-40'></span>
                    <h4 className='font-medium text-white dark:text-black'>Add Cupon</h4>
                    <span className='rounded-full text-white w-12 h-12 border 
            dark:border-yellow-800 flex 
            items-center justify-center transform transition-transform duration-300 group-hover:-translate-y-1 drop-shadow-none group-hover:drop-shadow-xl'><RiCoupon2Line size={20} /></span>
                </div>
            </Link>



            <Link href={ADMIN_MEDIA_SHOW}>
                <div className='group relative overflow-hidden flex items-center justify-between p-3
            rounded-lg shadow bg-white dark:bg-card
             bg-gradient-to-tr from-cyan-400 via-cyan-500 to-cyan-600
             transform-gpu transition-all duration-300 ease-out hover:scale-[1.04] hover:rotate-[0.5deg] hover:shadow-2xl
             ring-0 group-hover:ring-2 ring-white/30'>
                    <span className='pointer-events-none absolute -inset-12 -z-10 opacity-0 group-hover:opacity-50 blur-2xl 
                    bg-[conic-gradient(at_center,_#06b6d4_0%,_#22d3ee_25%,_#14b8a6_50%,_#22d3ee_75%,_#06b6d4_100%)] 
                    motion-safe:group-hover:animate-[spin_12s_linear_infinite_alternate]'></span>
                    <span className='pointer-events-none absolute inset-0 -z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-500 
                    bg-[radial-gradient(120%_60%_at_0%_0%,rgba(255,255,255,0.35),transparent_60%),radial-gradient(120%_60%_at_100%_100%,rgba(255,255,255,0.25),transparent_60%)] mix-blend-soft-light'></span>
                    <span className='pointer-events-none absolute top-1/2 left-[-30%] -z-10 h-[140%] w-[30%] -translate-x-full -translate-y-1/2 rotate-[25deg] 
                    bg-white/30 blur-md opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[350%] group-hover:opacity-40'></span>
                    <h4 className='font-medium text-white dark:text-black'>Upload Media</h4>
                    <span className='rounded-full text-white w-12
             h-12 border dark:border-cyan-800 flex
             items-center justify-center transform transition-transform duration-300 group-hover:-translate-y-1 drop-shadow-none group-hover:drop-shadow-xl'><MdOutlinePermMedia size={20} /></span>
                </div>
            </Link>

        </div>
    )
}

export default QuickAdd