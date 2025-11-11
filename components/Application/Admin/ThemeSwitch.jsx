'use client'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { LuMoon, LuSun } from 'react-icons/lu'

import { DropdownMenu,
     DropdownMenuContent, 
     DropdownMenuItem,
     DropdownMenuTrigger
     } from "@/components/ui/dropdown-menu"

const ThemeSwitch = () => {
 const {setTheme} = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                 <Button type="button" variant="ghost" className="cursor-pointer">
                    <LuMoon className='dark:hidden' />
                    <LuSun className='hidden dark:block'/>
                     </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
               
                <DropdownMenuItem onClick={()=> setTheme('light')}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={()=> setTheme('dark')}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={()=> setTheme('system')}>System</DropdownMenuItem>
            
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ThemeSwitch
