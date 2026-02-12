import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminMobileHeader from "@/components/admin/admin-mobile-header"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background dark:bg-background">
            {/* Mobile Header */}
            <AdminMobileHeader />
            
            <div className="flex">
                {/* Sidebar - Hidden on Mobile */}
                <div className="hidden md:block">
                    <AdminSidebar />
                </div>
                
                {/* Main Content */}
                <main className="flex-1 md:ml-64 pt-20 md:pt-6 pb-10 px-4 md:px-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
