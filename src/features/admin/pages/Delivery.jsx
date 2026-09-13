import { useEffect, useMemo, useState } from "react"
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Package,
  Search,
  Truck,
} from "lucide-react"

import { getAllOrders, updateOrderStatus } from "../../../services/orderService"

const STATUS_OPTIONS = [
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "ACCEPTED",
    label: "Accepted",
  },
  {
    value: "PREPARING",
    label: "Preparing",
  },
  {
    value: "READY",
    label: "Ready",
  },
  {
    value: "OUT_FOR_DELIVERY",
    label: "Out for Delivery",
  },
  {
    value: "DELIVERED",
    label: "Delivered",
  },
]

const STATUS_STYLES = {
  PENDING:
    "border-amber-200 bg-amber-50 text-amber-800",
  ACCEPTED:
    "border-indigo-200 bg-indigo-50 text-indigo-800",
  PREPARING:
    "border-orange-200 bg-orange-50 text-orange-800",
  READY:
    "border-sky-200 bg-sky-50 text-sky-800",
  OUT_FOR_DELIVERY:
    "border-blue-200 bg-blue-50 text-blue-800",
  DELIVERED:
    "border-emerald-200 bg-emerald-50 text-emerald-800",
}

const STATUS_LABELS = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  PREPARING: "Preparing",
  READY: "Ready",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
}

const NEXT_STATUS = {
  PENDING: {
    status: "ACCEPTED",
    label: "Accept Order",
  },
  ACCEPTED: {
    status: "PREPARING",
    label: "Start Preparing",
  },
  PREPARING: {
    status: "READY",
    label: "Mark Ready",
  },
  READY: {
    status: "OUT_FOR_DELIVERY",
    label: "Start Delivery",
  },
  OUT_FOR_DELIVERY: {
    status: "DELIVERED",
    label: "Mark Delivered",
  },
  DELIVERED: null,
}

function Delivery() {
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [locationFilter, setLocationFilter] = useState("ALL")
  const [expandedId, setExpandedId] = useState(null)

  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    loadDeliveryOrders()
  }, [])

  async function loadDeliveryOrders() {
    try {
      setLoading(true)
      setError("")

      const allOrders = await getAllOrders()

      const deliveryOrders = allOrders.filter(
        (order) => order.orderType === "DELIVERY"
      )

      setOrders(deliveryOrders)
    } catch (err) {
      console.error(err)
      setError("Unable to load delivery orders.")
    } finally {
      setLoading(false)
    }
  }

  const locations = useMemo(() => {
    const uniqueLocations = [
      ...new Set(
        orders
          .map((order) => order.deliveryLocation)
          .filter(Boolean)
      ),
    ]

    return uniqueLocations
  }, [orders])

  const filteredOrders = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    return orders.filter((order) => {
      const matchesSearch =
        !search ||
        order.id?.toLowerCase().includes(search) ||
        order.token?.toLowerCase().includes(search) ||
        order.customerName?.toLowerCase().includes(search) ||
        order.deliveryLocation
          ?.toLowerCase()
          .includes(search)

      const matchesStatus =
        statusFilter === "ALL" ||
        order.status === statusFilter

      const matchesLocation =
        locationFilter === "ALL" ||
        order.deliveryLocation === locationFilter

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLocation
      )
    })
  }, [
    orders,
    searchTerm,
    statusFilter,
    locationFilter,
  ])

  const stats = useMemo(() => {
    return {
      total: orders.length,

      preparing: orders.filter(
        (order) => order.status === "PREPARING"
      ).length,

      ready: orders.filter(
        (order) => order.status === "READY"
      ).length,

      outForDelivery: orders.filter(
        (order) =>
          order.status === "OUT_FOR_DELIVERY"
      ).length,

      delivered: orders.filter(
        (order) => order.status === "DELIVERED"
      ).length,
    }
  }, [orders])

  async function handleStatusChange(orderId, newStatus) {
    try {
      setUpdatingId(orderId)
      setError("")

      const updatedOrder = await updateOrderStatus(
        orderId,
        newStatus
      )

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? { ...order, ...updatedOrder }
            : order
        )
      )
    } catch (err) {
      console.error(err)
      setError(
        err.message ||
          "Unable to update delivery status."
      )
    } finally {
      setUpdatingId(null)
    }
  }

  function toggleDetails(orderId) {
    setExpandedId((currentId) =>
      currentId === orderId ? null : orderId
    )
  }

  return (
    <div className="min-h-screen bg-[#fbf9f5]">
      {/* Header */}
      <header className="border-b border-[#e6e1d7] bg-[#f4efe6] px-5 py-7 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#62816c]">
            Campus Delivery
          </p>

          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#1a382b] sm:text-4xl">
                Delivery Management
              </h1>

              <p className="mt-2 text-sm text-stone-600">
                Track and manage food delivery orders
                across campus.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-[#dcd5c8] bg-white px-3 py-2 text-xs font-semibold text-[#52665a]">
              <Truck size={16} />
              {stats.outForDelivery} currently in transit
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-5 sm:p-6 lg:p-8">
        {/* Error */}
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Deliveries"
            value={stats.total}
            detail="delivery orders"
            tone="stone"
          />

          <SummaryCard
            title="Preparing"
            value={stats.preparing}
            detail="being prepared"
            tone="orange"
          />

          <SummaryCard
            title="Ready"
            value={stats.ready}
            detail="waiting for delivery"
            tone="sky"
          />

          <SummaryCard
            title="Out for Delivery"
            value={stats.outForDelivery}
            detail="currently in transit"
            tone="blue"
          />
        </div>

        {/* Filters */}
        <section className="rounded-2xl border border-[#e6e1d7] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search customer, order, token, or location..."
                className="w-full rounded-xl border border-[#ddd7cb] bg-[#f7f3eb] py-3 pl-10 pr-4 text-sm text-stone-800 outline-none transition focus:border-[#7ca58a] focus:bg-white focus:ring-2 focus:ring-[#7ca58a]/20"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FilterSelect
                label="Status"
                value={statusFilter}
                onChange={setStatusFilter}
              >
                <option value="ALL">
                  All Statuses
                </option>

                {STATUS_OPTIONS.map((status) => (
                  <option
                    key={status.value}
                    value={status.value}
                  >
                    {status.label}
                  </option>
                ))}
              </FilterSelect>

              <FilterSelect
                label="Location"
                value={locationFilter}
                onChange={setLocationFilter}
              >
                <option value="ALL">
                  All Locations
                </option>

                {locations.map((location) => (
                  <option
                    key={location}
                    value={location}
                  >
                    {location}
                  </option>
                ))}
              </FilterSelect>
            </div>
          </div>
        </section>

        {/* Orders */}
        <section className="overflow-hidden rounded-2xl border border-[#e6e1d7] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#eee9df] px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-[#1a382b]">
                Delivery Orders
              </h2>

              <p className="mt-0.5 text-xs text-stone-500">
                {filteredOrders.length} order
                {filteredOrders.length !== 1
                  ? "s"
                  : ""}{" "}
                shown
              </p>
            </div>

            <div className="hidden items-center gap-2 text-xs text-stone-500 sm:flex">
              <Package size={15} />
              {stats.delivered} delivered
            </div>
          </div>

          {loading ? (
            <LoadingState />
          ) : filteredOrders.length === 0 ? (
            <EmptyState
              hasFilters={
                Boolean(searchTerm.trim()) ||
                statusFilter !== "ALL" ||
                locationFilter !== "ALL"
              }
            />
          ) : (
            <div className="divide-y divide-stone-100">
              {filteredOrders.map((order) => (
                <DeliveryOrder
                  key={order.id}
                  order={order}
                  expanded={
                    expandedId === order.id
                  }
                  updating={
                    updatingId === order.id
                  }
                  onToggle={() =>
                    toggleDetails(order.id)
                  }
                  onStatusChange={
                    handleStatusChange
                  }
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function DeliveryOrder({
  order,
  expanded,
  updating,
  onToggle,
  onStatusChange,
}) {
  const nextAction = NEXT_STATUS[order.status]

  const itemCount =
    order.items?.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    ) || 0

  return (
    <div className="transition-colors hover:bg-[#fcfbf8]">
      {/* Main Row */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* Order identity */}
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1a382b] text-xs font-bold text-white">
              {order.token || "—"}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-bold text-[#1a382b]">
                  {order.customerName ||
                    "Unknown Customer"}
                </p>

                <span
                  className={`inline-flex rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${
                    STATUS_STYLES[order.status] ||
                    "border-stone-200 bg-stone-50 text-stone-700"
                  }`}
                >
                  {STATUS_LABELS[order.status] ||
                    order.status}
                </span>
              </div>

              <p className="mt-0.5 text-xs text-stone-500">
                {order.id}
              </p>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-600">
                <span className="inline-flex items-center gap-1">
                  <MapPin size={13} />
                  {order.deliveryLocation ||
                    "Location not provided"}
                </span>

                <span>
                  {itemCount} item
                  {itemCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="flex items-center justify-between lg:block lg:w-28 lg:text-right">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">
                Total
              </p>

              <p className="mt-0.5 text-base font-bold text-[#1a382b]">
                ₹{order.total || 0}
              </p>
            </div>

            <p className="text-xs text-stone-500 lg:mt-1">
              {order.paymentMethod || "COD"}
            </p>
          </div>

          {/* Action */}
          <div className="flex items-center justify-between gap-2 lg:w-48 lg:justify-end">
            <button
              type="button"
              onClick={onToggle}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-[#62816c] transition hover:bg-[#f3f7f3] hover:text-[#1a382b]"
            >
              {expanded
                ? "Hide Details"
                : "View Details"}

              {expanded ? (
                <ChevronUp size={15} />
              ) : (
                <ChevronDown size={15} />
              )}
            </button>

            {nextAction ? (
              <button
                type="button"
                disabled={updating}
                onClick={() =>
                  onStatusChange(
                    order.id,
                    nextAction.status
                  )
                }
                className="rounded-lg border border-[#c9d9cc] bg-[#eaf2eb] px-3 py-2 text-xs font-bold text-[#1f4635] transition hover:bg-[#dfece1] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updating
                  ? "Updating..."
                  : nextAction.label}
              </button>
            ) : (
              <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                ✓ Completed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      {expanded && (
        <div className="border-t border-stone-100 bg-[#faf8f3] px-4 py-5 sm:px-5">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Detail
              label="Customer"
              value={
                order.customerName ||
                "Unknown Customer"
              }
            />

            <Detail
              label="Delivery Location"
              value={
                order.deliveryLocation ||
                "Not provided"
              }
            />

            <Detail
              label="Order Type"
              value={order.orderType || "DELIVERY"}
            />

            <Detail
              label="Payment"
              value={`${order.paymentMethod || "COD"} • ${
                order.paymentStatus || "PENDING"
              }`}
            />
          </div>

          {/* Items */}
          <div className="mt-5 border-t border-stone-200 pt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Items Ordered
            </p>

            <div className="mt-2 divide-y divide-stone-200">
              {order.items?.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <span className="text-stone-700">
                    {item.quantity} × {item.name}
                  </span>

                  <span className="font-semibold text-[#1a382b]">
                    ₹
                    {Number(item.price || 0) *
                      Number(item.quantity || 1)}
                  </span>
                </div>
              ))}

              <div className="flex items-center justify-between pt-3 text-sm font-bold text-[#1a382b]">
                <span>Total</span>
                <span>₹{order.total || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SummaryCard({
  title,
  value,
  detail,
  tone,
}) {
  const tones = {
    stone: "border-stone-200 bg-stone-50/70",
    orange: "border-orange-200 bg-orange-50/70",
    sky: "border-sky-200 bg-sky-50/70",
    blue: "border-blue-200 bg-blue-50/70",
  }

  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        tones[tone] || tones.stone
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-wider text-stone-600">
        {title}
      </p>

      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-3xl font-bold text-[#1a382b]">
          {value}
        </p>

        <p className="pb-1 text-right text-[11px] font-semibold text-stone-500">
          {detail}
        </p>
      </div>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-stone-500">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="min-w-0 rounded-xl border border-[#e6e1d7] bg-[#fbf9f5] px-3 py-3 text-sm font-semibold text-[#1a382b] outline-none transition focus:border-[#7ca58a] focus:ring-2 focus:ring-[#7ca58a]/20"
      >
        {children}
      </select>
    </label>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#1a382b]">
        {value}
      </p>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="p-10 text-center">
      <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-stone-200 border-t-[#1a382b]" />

      <p className="mt-3 text-sm text-stone-500">
        Loading delivery orders...
      </p>
    </div>
  )
}

function EmptyState({ hasFilters }) {
  return (
    <div className="p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f3efe7] text-[#718176]">
        <Package size={22} />
      </div>

      <p className="mt-4 text-sm font-semibold text-[#1a382b]">
        {hasFilters
          ? "No delivery orders match your filters"
          : "No delivery orders at this time"}
      </p>

      <p className="mt-1 text-xs text-stone-500">
        {hasFilters
          ? "Try changing your search or filters."
          : "Delivery orders will appear here when students place them."}
      </p>
    </div>
  )
}

export default Delivery;