import { NavLink } from "react-router-dom"

const links = [
  {
    label: "Dashboard",
    path: "/admin",
  },
  {
    label: "Orders",
    path: "/admin/orders",
  },
  {
    label: "Menu",
    path: "/admin/menu",
  },
  {
    label: "Delivery",
    path: "/admin/delivery",
  },
  {
    label: "Announcements",
    path: "/admin/announcements",
  },
  {
    label: "Reviews",
    path: "/admin/reviews",
  },
  {
    label: "Smart Queue",
    path: "/admin/queue",
  },
  {
    label: "Analytics",
    path: "/admin/analytics",
  },
  {
    label: "Cabin Bookings",
    path: "/admin/bookings",
  },
]

function AdminSidebar() {
  return (
    <aside className="w-64 shrink-0 bg-slate-900 p-5 text-white">
      <div className="mb-8">
        <h1 className="text-xl font-bold">
          Apple A Day
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Admin Panel
        </p>
      </div>

      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/admin"}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 text-sm transition ${
                isActive
                  ? "bg-white text-slate-900"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default AdminSidebar;