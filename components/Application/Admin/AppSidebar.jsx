'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarHeader,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image"

import { LuChevronRight } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";

import LogoBlack from '@/public/assets/images/logo-black.png'
import LogoWhite from '@/public/assets/images/logo-white.png'
import { Button } from "@/components/ui/button"
import { adminSidebarmenu } from "@/lib/AdminSidebarMenu";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import Link from "next/link";


const AppSidebar = () => {

   const { toggleSidebar } = useSidebar()

  return (
    <Sidebar className="z-50">
      <SidebarHeader className="border-b h-14 p-0">
        <div className="flex justify-between items-center px-4 h-full"> {/* ✅ Fixed: items-center instead of item-center, added h-full */}
          <Image
            src={LogoBlack}
            height={50}
            width={LogoBlack.width}
            className="block dark:hidden h-[50px] w-auto"
            alt="logo-dark"
          />

          <Image
            src={LogoWhite}
            height={50}
            width={LogoWhite.width}
            className="hidden dark:block h-[50px] w-auto"
            alt="logo-white"
          />

          <Button
            type="button" onClick={toggleSidebar}
            size='icon'
          //variant='ghost'  // ✅ Added variant for better styling
           className="md:hidden">
            <IoMdClose />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-3">
        <SidebarMenu>
          {adminSidebarmenu.map((menu, index) => (
            <Collapsible key={index} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton asChild className="font-semibold ps-2 py-5">
                    <Link href={menu?.url}>
                      <menu.icon />
                      {menu.title}
                      {menu.submenu && menu.submenu.length > 0 &&
                        <LuChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      }
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {menu.submenu && menu.submenu.length > 0 &&
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {menu.submenu.map((submenuItem, subMenuIndex) => (
                        <SidebarMenuSubItem key={subMenuIndex}>
                          <SidebarMenuSubButton asChild className=" ps-2 py-5">
                         
                            <Link href={submenuItem.url}>
                              <menu.icon className="h-4 w-4" />
                              <span>{submenuItem.title}</span>
                            </Link>

                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                      ))}

                    </SidebarMenuSub>

                  </CollapsibleContent>

                }
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>

      </SidebarContent>

    </Sidebar>
  )
}

export default AppSidebar
