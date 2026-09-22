import { createBrowserRouter } from "react-router-dom"

import AdminLayout from "../features/admin/components/AdminLayout"

import Dashboard from "../features/admin/pages/Dashboard"
import Orders from "../features/admin/pages/Orders"
import MenuManagement from "../features/admin/pages/MenuManagement"
import Delivery from "../features/admin/pages/Delivery"
import Announcements from "../features/admin/pages/Announcements"
import Reviews from "../features/admin/pages/Reviews"
import SmartQueue from "../features/admin/pages/SmartQueue"
import Analytics from "../features/admin/pages/Analytics"
import CabinBooking from "../features/admin/pages/CabinBooking"

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            Apple A Day
          </h1>

          <p className="mt-2 text-slate-500">
            Smart Campus Café
          </p>

          <a
            href="/admin"
            className="mt-6 inline-block rounded-lg bg-slate-900 px-5 py-3 text-white"
          >
            Open Admin Panel
          </a>
        </div>
      </div>
    ),
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "menu",
        element: <MenuManagement />,
      },
      {
        path: "delivery",
        element: <Delivery />,
      },
      {
        path: "announcements",
        element: <Announcements />,
      },
      {
        path: "reviews",
        element: <Reviews />,
      },
      {
        path: "queue",
        element: <SmartQueue />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "bookings",
        element: <CabinBooking />,
      },
    ],
  },
])

export default router