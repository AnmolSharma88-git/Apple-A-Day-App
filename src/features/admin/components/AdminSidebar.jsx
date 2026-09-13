import {
  BarChart3,
  Bell,
  Bike,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  MessageSquareText,
  Settings,
  Utensils,
  Zap,
} from "lucide-react"
import { NavLink } from "react-router-dom"

const sections = [
  {
    title: "Overview",
    links: [
      {
        label: "Dashboard",
        path: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Operations",
    links: [
      {
        label: "Orders",
        path: "/admin/orders",
        icon: ClipboardList,
      },
      {
        label: "Menu",
        path: "/admin/menu",
        icon: Utensils,
      },
      {
        label: "Smart Queue",
        path: "/admin/queue",
        icon: Zap,
      },
      {
        label: "Delivery",
        path: "/admin/delivery",
        icon: Bike,
      },
      {
        label: "Cabin Bookings",
        path: "/admin/bookings",
        icon: CalendarDays,
      },
    ],
  },
  {
    title: "Engagement",
    links: [
      {
        label: "Announcements",
        path: "/admin/announcements",
        icon: Bell,
      },
      {
        label: "Reviews",
        path: "/admin/reviews",
        icon: MessageSquareText,
      },
    ],
  },
  {
    title: "Insights",
    links: [
      {
        label: "Analytics",
        path: "/admin/analytics",
        icon: BarChart3,
      },
    ],
  },
]

function AdminSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[#e7e1d6] bg-[#fffdf9] lg:flex">

      {/* Brand */}

      <div className="border-b border-[#e7e1d6] px-6 py-6">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1f4635] text-2xl shadow-sm">
            🍎
          </div>

          <div>

            <h1 className="text-base font-bold tracking-tight text-[#193528]">
              Apple A Day
            </h1>

            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#718176]">
              Café Admin
            </p>

          </div>

        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-6">

        {sections.map((section) => (
          <div key={section.title}>

            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9a958b]">
              {section.title}
            </p>

            <div className="space-y-1">

              {section.links.map((link) => {
                const Icon = link.icon

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === "/admin"}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-[#e9f0e9] text-[#1f4635]"
                          : "text-[#625f58] hover:bg-[#f5f1e9] hover:text-[#1f4635]"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={18}
                          strokeWidth={
                            isActive ? 2.3 : 1.8
                          }
                        />

                        <span>{link.label}</span>
                      </>
                    )}
                  </NavLink>
                )
              })}

            </div>

          </div>
        ))}

      </nav>

      {/* Bottom */}

      <div className="border-t border-[#e7e1d6] p-4">

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#625f58] transition hover:bg-[#f5f1e9] hover:text-[#1f4635]"
        >
          <Settings size={18} />

          <span>Settings</span>
        </button>

        <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#f6f2ea] p-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9e5da] text-sm font-bold text-[#1f4635]">
            A
          </div>

          <div className="min-w-0">

            <p className="truncate text-xs font-bold text-[#193528]">
              Admin
            </p>

            <p className="truncate text-[11px] text-[#8a867d]">
              Café Manager
            </p>

          </div>

        </div>

      </div>

    </aside>
  )
}

export default AdminSidebar;