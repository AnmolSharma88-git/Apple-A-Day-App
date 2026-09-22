import { useEffect, useMemo, useState } from "react"
import {
  ArrowRight,
  Bike,
  CheckCircle2,
  ChefHat,
  ClipboardList,
  Clock3,
  PackageCheck,
  Search,
  ShoppingBag,
  TrendingUp,
  Utensils,
  Zap,
} from "lucide-react"
import { Link } from "react-router-dom"

import { getAllOrders } from "../../../services/orderService"
import {
  ORDER_STATUS,
} from "../../../constants/orderStatus"
import {
  ORDER_TYPES,
} from "../../../constants/orderTypes"

function Dashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getAllOrders()
        setOrders(data)
      } catch (error) {
        console.error(
          "Failed to load dashboard orders:",
          error
        )
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  const stats = useMemo(() => {
    const pending = orders.filter(
      (order) =>
        order.status === ORDER_STATUS.PENDING
    ).length

    const preparing = orders.filter(
      (order) =>
        order.status === ORDER_STATUS.PREPARING
    ).length

    const completed = orders.filter(
      (order) =>
        order.status === ORDER_STATUS.PICKED_UP ||
        order.status === ORDER_STATUS.DELIVERED
    ).length

    const pickup = orders.filter(
      (order) =>
        order.orderType === ORDER_TYPES.PICKUP
    ).length

    const delivery = orders.filter(
      (order) =>
        order.orderType === ORDER_TYPES.DELIVERY
    ).length

    const revenue = orders
      .filter(
        (order) =>
          order.status === ORDER_STATUS.PICKED_UP ||
          order.status === ORDER_STATUS.DELIVERED
      )
      .reduce(
        (sum, order) =>
          sum + Number(order.total || 0),
        0
      )

    return {
      pending,
      preparing,
      completed,
      pickup,
      delivery,
      revenue,
    }
  }, [orders])

  const recentOrders = useMemo(() => {
    const searchText = search.toLowerCase()

    return orders
      .filter((order) => {
        return (
          order.customerName
            ?.toLowerCase()
            .includes(searchText) ||
          order.token
            ?.toLowerCase()
            .includes(searchText)
        )
      })
      .slice(0, 5)
  }, [orders, search])

  const hourlyOrders = useMemo(() => {
    const hours = [
      "10 AM",
      "11 AM",
      "12 PM",
      "1 PM",
      "2 PM",
      "3 PM",
      "4 PM",
      "5 PM",
    ]

    return hours.map((label) => {
      const hour = Number(
        label.split(" ")[0]
      )

      const count = orders.filter((order) => {
        const date = new Date(order.createdAt)

        let orderHour = date.getHours()

        if (
          label.includes("PM") &&
          orderHour < 12
        ) {
          orderHour += 12
        }

        return orderHour === hour
      }).length

      return {
        label,
        count,
      }
    })
  }, [orders])

  const maxHourlyOrders = Math.max(
    ...hourlyOrders.map((item) => item.count),
    1
  )

  if (loading) {
    return <DashboardLoader />
  }

  return (
    <section className="space-y-6">

      {/* PAGE HEADER */}

      <header className="flex flex-col gap-4 border-b border-[#e6e1d7] pb-5 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#708075]">
            Today at Apple A Day
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#193528] sm:text-3xl">
            Café Overview
          </h1>

          <p className="mt-2 max-w-xl text-xs leading-5 text-[#77736b] sm:text-sm">
            A quick look at today’s café activity,
            orders, and operations.
          </p>

        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#cfe0d1] bg-[#f0f6f0] px-3 py-2 text-[10px] font-bold text-[#52705d]">

          <span className="h-1.5 w-1.5 rounded-full bg-[#4e9b67]" />

          Café Live

        </div>

      </header>

      {/* PRIMARY STATS */}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Orders"
          value={orders.length}
          subtitle="orders today"
          icon={ClipboardList}
        />

        <StatCard
          title="Pending"
          value={stats.pending}
          subtitle="need attention"
          icon={Clock3}
        />

        <StatCard
          title="Preparing"
          value={stats.preparing}
          subtitle="in kitchen"
          icon={ChefHat}
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          subtitle="finished orders"
          icon={CheckCircle2}
        />

      </div>

      {/* SECONDARY STATS */}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

        <MiniStat
          label="Pickup Orders"
          value={stats.pickup}
          icon={ShoppingBag}
        />

        <MiniStat
          label="Delivery Orders"
          value={stats.delivery}
          icon={Bike}
        />

        <MiniStat
          label="Completed Revenue"
          value={`₹${stats.revenue}`}
          icon={TrendingUp}
        />

      </div>

      {/* MAIN GRID */}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)]">

        {/* RECENT ORDERS */}

        <div className="min-w-0 rounded-2xl border border-[#e6e1d7] bg-white shadow-sm">

          <div className="border-b border-[#eeeae2] p-4 sm:p-5">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#708075]">
                  Live Feed
                </p>

                <h2 className="mt-1 text-lg font-bold text-[#193528]">
                  Recent Orders
                </h2>

              </div>

              <Link
                to="/admin/orders"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#315d45] hover:text-[#193528]"
              >
                View all
                <ArrowRight size={13} />
              </Link>

            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">

              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#e4dfd5] bg-[#fbf9f5] px-3 py-2.5">

                <Search
                  size={15}
                  className="shrink-0 text-[#9b978e]"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search customer or token..."
                  className="min-w-0 w-full bg-transparent text-xs outline-none placeholder:text-[#a5a097]"
                />

              </div>

            </div>

          </div>

          <div>

            {recentOrders.length === 0 ? (
              <div className="p-10 text-center">

                <ClipboardList
                  size={28}
                  className="mx-auto text-[#aaa59b]"
                />

                <p className="mt-3 text-sm font-bold text-[#59564f]">
                  No orders found
                </p>

              </div>
            ) : (
              recentOrders.map((order) => (
                <RecentOrder
                  key={order.id}
                  order={order}
                />
              ))
            )}

          </div>

        </div>

        {/* QUICK ACTIONS */}

        <div className="rounded-2xl border border-[#e6e1d7] bg-white p-4 shadow-sm sm:p-5">

          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#708075]">
            Shortcuts
          </p>

          <h2 className="mt-1 text-lg font-bold text-[#193528]">
            Quick Actions
          </h2>

          <p className="mt-1 text-xs text-[#8a867d]">
            Jump directly into common tasks.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2">

            <QuickAction
              to="/admin/menu"
              label="Manage Menu"
              description="Items & availability"
              icon={Utensils}
            />

            <QuickAction
              to="/admin/queue"
              label="Order Queue"
              description="Kitchen workflow"
              icon={Zap}
            />

            <QuickAction
              to="/admin/delivery"
              label="Delivery"
              description="Track deliveries"
              icon={Bike}
            />

            <QuickAction
              to="/admin/analytics"
              label="Analytics"
              description="Sales insights"
              icon={TrendingUp}
            />

          </div>

        </div>

      </div>

      {/* LOWER GRID */}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)]">

        {/* ORDER TREND */}

        <div className="rounded-2xl border border-[#e6e1d7] bg-white p-4 shadow-sm sm:p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#708075]">
                Café Activity
              </p>

              <h2 className="mt-1 text-lg font-bold text-[#193528]">
                Order Trend
              </h2>

            </div>

            <span className="rounded-lg bg-[#f5f1e9] px-2.5 py-1.5 text-[10px] font-bold text-[#77736b]">
              Today
            </span>

          </div>

          <div className="mt-7 flex h-40 items-end gap-2 sm:gap-4">

            {hourlyOrders.map((item) => {
              const height =
                item.count === 0
                  ? 8
                  : Math.max(
                      18,
                      (item.count /
                        maxHourlyOrders) *
                        100
                    )

              return (
                <div
                  key={item.label}
                  className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
                >

                  <span className="text-[9px] font-bold text-[#78907d]">
                    {item.count || ""}
                  </span>

                  <div
                    className="w-full max-w-8 rounded-t-md bg-[#6d9f7a] transition-all"
                    style={{
                      height: `${height}%`,
                    }}
                  />

                  <span className="text-[8px] text-[#99948b] sm:text-[9px]">
                    {item.label}
                  </span>

                </div>
              )
            })}

          </div>

          <div className="mt-4 flex items-center gap-2 text-[10px] text-[#8a867d]">

            <TrendingUp
              size={12}
              className="text-[#5f8f6c]"
            />

            Order activity updates from live order
            data.

          </div>

        </div>

        {/* SIGNALS */}

        <div className="rounded-2xl border border-[#e6e1d7] bg-white p-4 shadow-sm sm:p-5">

          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#708075]">
            At a Glance
          </p>

          <h2 className="mt-1 text-lg font-bold text-[#193528]">
            Today's Signals
          </h2>

          <div className="mt-5 space-y-2">

            <Signal
              label="Active Orders"
              value={
                stats.pending +
                stats.preparing
              }
            />

            <Signal
              label="Pickup"
              value={stats.pickup}
            />

            <Signal
              label="Delivery"
              value={stats.delivery}
            />

            <Signal
              label="Revenue"
              value={`₹${stats.revenue}`}
            />

          </div>

        </div>

      </div>

    </section>
  )
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}) {
  return (
    <div className="rounded-2xl border border-[#e6e1d7] bg-white p-4 shadow-sm sm:p-5">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7b857e]">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-[#193528]">
            {value}
          </p>

          <p className="mt-1 text-[10px] text-[#969188]">
            {subtitle}
          </p>

        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1f4ef] text-[#52705d]">
          <Icon size={16} />
        </div>

      </div>

      <Link
        to="/admin/orders"
        className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold text-[#52705d]"
      >
        View details
        <ArrowRight size={11} />
      </Link>

    </div>
  )
}

function MiniStat({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#e6e1d7] bg-white px-4 py-3 shadow-sm">

      <div className="flex items-center gap-3">

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5f1e9] text-[#52705d]">
          <Icon size={14} />
        </div>

        <span className="text-xs font-semibold text-[#625f58]">
          {label}
        </span>

      </div>

      <span className="text-sm font-bold text-[#193528]">
        {value}
      </span>

    </div>
  )
}

function RecentOrder({ order }) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#eeeae2] px-4 py-3.5 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:px-5">

      <div className="flex min-w-0 items-center gap-3">

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#193528] text-[9px] font-bold text-white">
          {order.token}
        </div>

        <div className="min-w-0">

          <p className="truncate text-xs font-bold text-[#393833]">
            {order.customerName}
          </p>

          <p className="mt-0.5 text-[9px] text-[#89857c]">
            {order.items?.length || 0} items
            {" · "}
            {formatOrderType(order.orderType)}
            {" · "}
            ₹{order.total}
          </p>

        </div>

      </div>

      <StatusBadge status={order.status} />

    </div>
  )
}

function QuickAction({
  to,
  label,
  description,
  icon: Icon,
}) {
  return (
    <Link
      to={to}
      className="group rounded-xl border border-[#e5dfd4] bg-[#fcfaf6] p-3 transition hover:border-[#cbd9cd] hover:bg-[#f5f8f4]"
    >

      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#52705d] shadow-sm ring-1 ring-[#eee9df]">
        <Icon size={14} />
      </div>

      <p className="mt-3 text-xs font-bold text-[#393833]">
        {label}
      </p>

      <p className="mt-0.5 text-[9px] text-[#918d84]">
        {description}
      </p>

    </Link>
  )
}

function Signal({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#e5dfd4] px-3 py-2.5">

      <span className="text-[10px] font-medium text-[#77736b]">
        {label}
      </span>

      <span className="text-xs font-bold text-[#193528]">
        {value}
      </span>

    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    PENDING:
      "border-amber-200 bg-amber-50 text-amber-700",

    ACCEPTED:
      "border-orange-200 bg-orange-50 text-orange-700",

    PREPARING:
      "border-blue-200 bg-blue-50 text-blue-700",

    READY:
      "border-emerald-200 bg-emerald-50 text-emerald-700",

    PICKED_UP:
      "border-green-200 bg-green-50 text-green-700",

    OUT_FOR_DELIVERY:
      "border-purple-200 bg-purple-50 text-purple-700",

    DELIVERED:
      "border-green-200 bg-green-50 text-green-700",
  }

  const labels = {
    PENDING: "Pending",
    ACCEPTED: "Accepted",
    PREPARING: "Preparing",
    READY: "Ready",
    PICKED_UP: "Picked Up",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
  }

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[9px] font-bold ${
        styles[status] ||
        "border-stone-200 bg-stone-50 text-stone-600"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status] || status}
    </span>
  )
}

function formatOrderType(type) {
  return type === ORDER_TYPES.DELIVERY
    ? "Delivery"
    : "Pickup"
}

function DashboardLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">

      <div className="text-center">

        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#d9e5da] border-t-[#315d45]" />

        <p className="mt-3 text-xs font-medium text-[#858078]">
          Loading dashboard...
        </p>

      </div>

    </div>
  )
}

export default Dashboard;