import {
  BarChart3,
  Bell,
  Bike,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Settings,
  Utensils,
  X,
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

function AdminMobileNav({ open, onClose }) {
  return (
    <>
      {/* Mobile Header */}

      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#e7e1d6] bg-[#fffdf9]/95 px-4 backdrop-blur lg:hidden">

        <div className="flex items-center gap-2.5">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1f4635] text-lg">
            🍎
          </div>

          <div>
            <p className="text-sm font-bold text-[#193528]">
              Apple A Day
            </p>

            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8a958c]">
              Café Admin
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label={open ? "Close navigation" : "Open navigation"}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e4ded3] bg-white text-[#315d45] shadow-sm"
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>

      </header>

      {/* Overlay */}

      {open && (
        <div
          className="fixed inset-0 z-40 bg-[#193528]/20 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[285px] overflow-y-auto border-r border-[#e7e1d6] bg-[#fffdf9] shadow-2xl transition-transform duration-300 lg:hidden ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        <div className="flex items-center justify-between border-b border-[#e7e1d6] px-5 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f4635] text-xl">
              🍎
            </div>

            <div>
              <p className="text-sm font-bold text-[#193528]">
                Apple A Day
              </p>

              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8a958c]">
                Café Admin
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#77736b] hover:bg-[#f5f1e9]"
          >
            <X size={18} />
          </button>

        </div>

        <nav className="space-y-7 px-3 py-6">

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
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                          isActive
                            ? "bg-[#e9f0e9] text-[#1f4635]"
                            : "text-[#625f58] hover:bg-[#f5f1e9] hover:text-[#1f4635]"
                        }`
                      }
                    >
                      <Icon size={18} />

                      <span>{link.label}</span>
                    </NavLink>
                  )
                })}

              </div>

            </div>
          ))}

        </nav>

        <div className="border-t border-[#e7e1d6] p-4">

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#625f58] hover:bg-[#f5f1e9]"
          >
            <Settings size={18} />

            <span>Settings</span>
          </button>

          <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#f6f2ea] p-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9e5da] text-sm font-bold text-[#1f4635]">
              A
            </div>

            <div>
              <p className="text-xs font-bold text-[#193528]">
                Admin
              </p>

              <p className="text-[11px] text-[#8a867d]">
                Café Manager
              </p>
            </div>

          </div>

        </div>

      </aside>
    </>
  )
}

export default AdminMobileNav;