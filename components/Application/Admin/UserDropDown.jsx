'use client'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// User dropdown icon.
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";

import adminLogo from '@/public/assets/images/admin.png'
import { store } from "@/store/store"
import Link from "next/link"
import { useSelector } from "react-redux"
import LogOutButton from "./LogOutButton";
const UserDropDown = () => {

    const auth = useSelector((store)=> store.authStore.auth)

    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage src={adminLogo.src}  />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="me-5 w-44">
                <DropdownMenuLabel ><p className="font-semibold" > {auth?.user.name} </p>
                {/* <span className="font-normal text-sm line-clamp-1" >{auth?.user.email}</span> */}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="flex">
                    <Link href="">
                    <IoShirtOutline/>
                    New Product </Link>
                </DropdownMenuItem>

                 <DropdownMenuItem asChild className="flex">
                    <Link href="">
                    <MdOutlineShoppingBag/>
                    Order </Link>
                </DropdownMenuItem>
               <LogOutButton/>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropDown
