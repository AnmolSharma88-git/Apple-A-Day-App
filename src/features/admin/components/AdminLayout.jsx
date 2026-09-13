import { Outlet } from "react-router-dom"

import AdminSidebar from "./AdminSidebar"

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout;