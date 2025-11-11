'use client'
import React from 'react'
import ThemeSwitch from './ThemeSwitch'
import UserDropDown from './UserDropDown'
import { Button } from '@/components/ui/button'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { RiMenu4Fill } from "react-icons/ri"
import { LuSearch } from "react-icons/lu"
import SearchBar from './SearchBar'

const Topbar = () => {
    const { toggleSidebar } = useSidebar()

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 lg:px-6">
            {/* Left section - Toggle & Search */}
            <div className="flex items-center gap-3 flex-1">
                {/* ✅ Sidebar toggle button */}
                <SidebarTrigger className="-ml-2">
                    <RiMenu4Fill className="h-5 w-5" />
                    <span className="sr-only">Toggle Sidebar</span>
                </SidebarTrigger>

                {/* ✅ Search bar */}
               <SearchBar/>
            </div>

            {/* Right section - Actions */}
            <div className="flex items-center gap-2">
                {/* Mobile search button */}
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="md:hidden"
                    onClick={() => window.dispatchEvent(new Event('open-admin-search'))}
                >
                    <LuSearch className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                </Button>

                <ThemeSwitch />
                <UserDropDown />

                <Button onClick={toggleSidebar} type="button" size="icon" className="ms-2 md:hidden">

                    <RiMenu4Fill />

                </Button>

            </div>
        </header>
    )
}

export default Topbar
