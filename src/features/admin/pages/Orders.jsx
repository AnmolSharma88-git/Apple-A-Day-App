import { useEffect, useMemo, useState } from "react"
import {
  ClipboardList,
  Search,
  SlidersHorizontal,
} from "lucide-react"

import OrderTable from "../components/OrderTable"
import { getAllOrders } from "../../../services/orderService"

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] =
    useState("ALL")

  const [statusFilter, setStatusFilter] =
    useState("ALL")

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getAllOrders()
        setOrders(data)
      } catch (error) {
        console.error(
          "Failed to load orders:",
          error
        )
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  function handleOrderUpdated(updatedOrder) {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === updatedOrder.id
          ? updatedOrder
          : order
      )
    )
  }

  const filteredOrders = useMemo(() => {
    const searchText =
      search.trim().toLowerCase()

    return orders.filter((order) => {
      const matchesSearch =
        !searchText ||
        (order.customerName || "")
          .toLowerCase()
          .includes(searchText) ||
        (order.token || "")
          .toLowerCase()
          .includes(searchText) ||
        (order.id || "")
          .toLowerCase()
          .includes(searchText)

      const matchesType =
        typeFilter === "ALL" ||
        order.orderType === typeFilter

      const matchesStatus =
        statusFilter === "ALL" ||
        order.status === statusFilter

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      )
    })
  }, [
    orders,
    search,
    typeFilter,
    statusFilter,
  ])

  return (
    <section className="space-y-5 sm:space-y-6">

      {/* HEADER */}

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <div className="flex items-center gap-2.5">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e9f0e9] text-[#315d45]">
              <ClipboardList size={17} />
            </div>

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#708075]">
                Operations
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-[#193528] sm:text-3xl">
                Orders
              </h1>

            </div>

          </div>

          <p className="mt-2 max-w-xl text-xs leading-5 text-[#77736b] sm:text-sm">
            View and manage customer orders from
            the café.
          </p>

        </div>

        <div className="w-fit rounded-full border border-[#e6e1d7] bg-white px-3.5 py-2 text-[10px] font-bold text-[#625f58] shadow-sm">
          {filteredOrders.length} shown
          <span className="mx-1 text-[#bbb5ab]">
            /
          </span>
          {orders.length} total
        </div>

      </header>

      {/* FILTER BAR */}

      <div className="rounded-2xl border border-[#e6e1d7] bg-white p-3.5 shadow-sm sm:p-4">

        <div className="flex flex-col gap-3">

          {/* SEARCH */}

          <div className="flex min-w-0 items-center gap-2 rounded-xl border border-[#e4dfd5] bg-[#fbf9f5] px-3.5 py-2.5">

            <Search
              size={16}
              className="shrink-0 text-[#9b978e]"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search customer, token or order ID..."
              className="min-w-0 w-full bg-transparent text-xs outline-none placeholder:text-[#a5a097] sm:text-sm"
            />

          </div>

          {/* FILTERS */}

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">

            <div className="flex items-center gap-2">

              <SlidersHorizontal
                size={15}
                className="shrink-0 text-[#8e897f]"
              />

              <span className="text-[10px] font-bold uppercase tracking-wide text-[#8b877f]">
                Type
              </span>

            </div>

            <FilterButton
              active={typeFilter === "ALL"}
              onClick={() =>
                setTypeFilter("ALL")
              }
            >
              All
            </FilterButton>

            <FilterButton
              active={typeFilter === "PICKUP"}
              onClick={() =>
                setTypeFilter("PICKUP")
              }
            >
              Pickup
            </FilterButton>

            <FilterButton
              active={typeFilter === "DELIVERY"}
              onClick={() =>
                setTypeFilter("DELIVERY")
              }
            >
              Delivery
            </FilterButton>

            <div className="hidden h-5 w-px bg-[#e5dfd4] sm:block" />

            <span className="text-[10px] font-bold uppercase tracking-wide text-[#8b877f]">
              Status
            </span>

            <StatusFilter
              value={statusFilter}
              onChange={setStatusFilter}
            />

          </div>

        </div>

      </div>

      {/* CONTENT */}

      {loading ? (
        <LoadingState />
      ) : filteredOrders.length === 0 ? (
        <EmptyState />
      ) : (
        <OrderTable
          orders={filteredOrders}
          onOrderUpdated={handleOrderUpdated}
        />
      )}

    </section>
  )
}

function FilterButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-[10px] font-bold transition ${
        active
          ? "bg-[#315d45] text-white"
          : "bg-[#f7f3eb] text-[#706c64] hover:bg-[#eee9df]"
      }`}
    >
      {children}
    </button>
  )
}

function StatusFilter({
  value,
  onChange,
}) {
  return (
    <select
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      className="w-full rounded-lg border border-[#ded8cc] bg-white px-3 py-2 text-[10px] font-bold text-[#625f58] outline-none focus:border-[#7c9b82] sm:w-auto"
    >
      <option value="ALL">All statuses</option>
      <option value="PENDING">Pending</option>
      <option value="ACCEPTED">Accepted</option>
      <option value="PREPARING">Preparing</option>
      <option value="READY">Ready</option>
      <option value="PICKED_UP">
        Picked Up
      </option>
      <option value="OUT_FOR_DELIVERY">
        Out for Delivery
      </option>
      <option value="DELIVERED">
        Delivered
      </option>
    </select>
  )
}

function LoadingState() {
  return (
    <div className="rounded-2xl border border-[#e6e1d7] bg-white p-12 text-center shadow-sm">

      <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#d9e5da] border-t-[#315d45]" />

      <p className="mt-3 text-xs font-medium text-[#858078]">
        Loading orders...
      </p>

    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-[#e6e1d7] bg-white p-10 text-center shadow-sm sm:p-14">

      <ClipboardList
        size={32}
        className="mx-auto text-[#aaa59b]"
      />

      <h2 className="mt-4 text-sm font-bold text-[#59564f]">
        No orders found
      </h2>

      <p className="mt-1 text-xs text-[#918d84]">
        Try changing your search or filters.
      </p>

    </div>
  )
}

export default Orders;