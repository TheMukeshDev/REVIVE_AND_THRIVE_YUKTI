import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminMobileHeader from "@/components/admin/admin-mobile-header"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen w-full bg-background dark:bg-background overflow-hidden">
            {/* Mobile & Tablet Header - Visible on screens below lg */}
            <div className="lg:hidden">
                <AdminMobileHeader />
            </div>
            
            <div className="flex w-full h-screen lg:h-auto">
                {/* Desktop Sidebar - Visible on lg and above */}
                <div className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 border-r border-border">
                    <AdminSidebar />
                </div>
                
                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden pt-16 sm:pt-16 lg:pt-0 pb-10 px-3 sm:px-4 md:px-6 lg:px-8 w-full">
                    <div className="h-full w-full max-w-full lg:max-w-7xl mx-auto py-4 sm:py-6 md:py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
