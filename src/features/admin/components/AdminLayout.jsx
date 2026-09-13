import { useState } from "react"
import { Outlet } from "react-router-dom"

import AdminSidebar from "./AdminSidebar"
import AdminMobileNav from "./AdminMobileNav"

function AdminLayout() {
  const [mobileNavOpen, setMobileNavOpen] =
    useState(false)

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#393833]">

      {/* Desktop Sidebar */}

      <AdminSidebar />

      {/* Mobile Navigation */}

      <AdminMobileNav
        open={mobileNavOpen}
        onClose={() =>
          setMobileNavOpen((current) => !current)
        }
      />

      {/* Main Area */}

      <main className="min-w-0 lg:ml-64">

        <div className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">

          <Outlet />

        </div>

      </main>

    </div>
  )
}

export default AdminLayout;