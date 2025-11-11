import AppSidebar from '@/components/Application/Admin/AppSidebar'
import ThemeProvider from '@/components/Application/Admin/ThemeProvider'
import Topbar from '@/components/Application/Admin/Topbar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import React from 'react'

const layout = ({ children }) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange

        >
            <SidebarProvider>
                <div className="flex h-screen w-full overflow-hidden">
                    <AppSidebar />

                    <SidebarInset className="flex-1 flex flex-col overflow-hidden">
                        <Topbar />

                        <main className="flex-1 overflow-auto">
                            <div className="p-5 min-h-[calc(100vh-40px-56px)]">
                                {children}
                            </div>
                        </main>

                        <footer className="border-t h-[40px] flex items-center justify-center bg-muted/50 text-sm">
                            © 2025 TFKiot. All rights reserved
                        </footer>
                    </SidebarInset>
                </div>
            </SidebarProvider>

        </ThemeProvider>

    )
}

export default layout
