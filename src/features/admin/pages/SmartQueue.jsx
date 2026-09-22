import { useEffect, useMemo, useState } from "react"
import {
  Check,
  Clock3,
  Search,
  ShoppingBag,
  Truck,
  Zap,
} from "lucide-react"

import { getQueueOrders } from "../../../services/queueService"

function SmartQueue() {
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")
  const [minPriority, setMinPriority] = useState("")
  const [maxPriority, setMaxPriority] = useState("")

  useEffect(() => {
    async function loadQueue() {
      try {
        const data = await getQueueOrders()
        setQueue(data)
      } catch (error) {
        console.error("Failed to load queue:", error)
      } finally {
        setLoading(false)
      }
    }

    loadQueue()
  }, [])

  const filteredQueue = useMemo(() => {
    return queue.filter((item) => {
      const search = searchTerm.toLowerCase()

      const customerName =
        item.customerName?.toLowerCase() || ""

      const token =
        item.token?.toLowerCase() || ""

      const matchesSearch =
        customerName.includes(search) ||
        token.includes(search)

      const priority = Number(
        item.priorityScore || 0
      )

      const matchesMin =
        minPriority === "" ||
        priority >= Number(minPriority)

      const matchesMax =
        maxPriority === "" ||
        priority <= Number(maxPriority)

      return (
        matchesSearch &&
        matchesMin &&
        matchesMax
      )
    })
  }, [
    queue,
    searchTerm,
    minPriority,
    maxPriority,
  ])

  function markDone(orderId) {
    setQueue((currentQueue) =>
      currentQueue.filter(
        (order) => order.id !== orderId
      )
    )
  }

  function getPriorityStyle(score) {
    if (score >= 80) {
      return {
        text: "text-amber-700",
        bg: "bg-amber-50",
        label: "High priority",
      }
    }

    if (score >= 60) {
      return {
        text: "text-[#315d45]",
        bg: "bg-[#e9f0e9]",
        label: "Medium priority",
      }
    }

    return {
      text: "text-stone-700",
      bg: "bg-stone-100",
      label: "Normal priority",
    }
  }

  function getTypeBadge(type) {
    const isDelivery = type === "DELIVERY"

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
          isDelivery
            ? "border-amber-200 bg-amber-50 text-amber-800"
            : "border-emerald-200 bg-emerald-50 text-emerald-800"
        }`}
      >
        {isDelivery ? (
          <Truck size={13} />
        ) : (
          <ShoppingBag size={13} />
        )}

        {isDelivery ? "Delivery" : "Pickup"}
      </span>
    )
  }

  return (
    <section className="min-h-full space-y-6 bg-[#fbf9f5]">
      {/* Header */}
      <header className="rounded-2xl border border-[#e6e1d7] bg-[#f4efe6] px-5 py-6 sm:px-7">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9f0e9] text-[#315d45]">
                <Zap size={20} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#708075]">
                  Operations
                </p>

                <h1 className="text-2xl font-bold tracking-tight text-[#193528] sm:text-3xl">
                  Smart Queue
                </h1>
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#77736b]">
              Prioritize active orders based on waiting
              time, preparation workload and delivery
              priority.
            </p>
          </div>

          {/* Queue count */}
          <div className="flex items-center gap-3 self-start rounded-xl border border-[#ded8cc] bg-white px-4 py-3 md:self-auto">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e9f0e9] text-[#315d45]">
              <Clock3 size={17} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#908b82]">
                In queue
              </p>

              <p className="text-xl font-bold text-[#193528]">
                {filteredQueue.length}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="rounded-2xl border border-[#e6e1d7] bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          {/* Search */}
          <div className="flex items-center gap-2 rounded-xl border border-[#e1dbd0] bg-[#fbf9f5] px-3.5 py-2.5">
            <Search
              size={17}
              className="shrink-0 text-[#9b978e]"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search by customer or token..."
              className="w-full bg-transparent text-sm text-[#393833] outline-none placeholder:text-[#aaa59b]"
            />
          </div>

          {/* Priority */}
          <div className="flex items-center gap-2">
            <span className="hidden text-xs font-bold uppercase tracking-wider text-[#8c877e] sm:block">
              Priority
            </span>

            <input
              type="number"
              min="0"
              max="100"
              value={minPriority}
              onChange={(event) =>
                setMinPriority(event.target.value)
              }
              placeholder="From"
              className="w-full rounded-xl border border-[#ded8cc] bg-[#fbf9f5] px-3 py-2.5 text-sm outline-none focus:border-[#7c9b82] focus:ring-2 focus:ring-[#dce9de] sm:w-20"
            />

            <span className="text-[#aaa59b]">
              –
            </span>

            <input
              type="number"
              min="0"
              max="100"
              value={maxPriority}
              onChange={(event) =>
                setMaxPriority(event.target.value)
              }
              placeholder="To"
              className="w-full rounded-xl border border-[#ded8cc] bg-[#fbf9f5] px-3 py-2.5 text-sm outline-none focus:border-[#7c9b82] focus:ring-2 focus:ring-[#dce9de] sm:w-20"
            />
          </div>

          {/* Reset */}
          <button
            type="button"
            onClick={() => {
              setSearchTerm("")
              setMinPriority("")
              setMaxPriority("")
            }}
            className="rounded-xl border border-[#ded8cc] bg-white px-4 py-2.5 text-xs font-bold text-[#625f58] transition hover:bg-[#f7f3eb]"
          >
            Clear filters
          </button>
        </div>
      </div>

      {/* Queue */}
      {loading ? (
        <div className="rounded-2xl border border-[#e6e1d7] bg-white p-12 text-center shadow-sm">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#d9e5da] border-t-[#315d45]" />

          <p className="mt-3 text-sm text-[#858078]">
            Loading smart queue...
          </p>
        </div>
      ) : filteredQueue.length === 0 ? (
        <div className="rounded-2xl border border-[#e6e1d7] bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#e9f0e9] text-[#315d45]">
            <Check size={22} />
          </div>

          <h2 className="mt-4 text-sm font-bold text-[#59564f]">
            No orders in queue
          </h2>

          <p className="mt-1 text-xs text-[#918d84]">
            No active orders match your current filters.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQueue.map((item, index) => {
            const priorityStyle =
              getPriorityStyle(
                Number(item.priorityScore)
              )

            return (
              <article
                key={item.id}
                className="rounded-2xl border border-[#e6e1d7] bg-white p-4 shadow-sm transition hover:border-[#c7d5c9] hover:shadow-md sm:p-5"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
                  {/* Token / Customer */}
                  <div className="flex min-w-0 items-center gap-3 xl:w-60">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#193528] text-xs font-bold text-white">
                      {item.token}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#302f2b]">
                        {item.customerName}
                      </p>

                      <p className="mt-0.5 text-xs text-[#99948b]">
                        Position #{index + 1}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <p className="text-[11px] font-medium text-[#99948b]">
                        Waiting
                      </p>

                      <p className="mt-1 text-sm font-bold text-[#393833]">
                        {item.orderAge} min
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium text-[#99948b]">
                        Prep time
                      </p>

                      <p className="mt-1 text-sm font-bold text-[#393833]">
                        {item.preparationTime} min
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium text-[#99948b]">
                        Priority
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`text-sm font-bold ${priorityStyle.text}`}
                        >
                          {item.priorityScore}
                        </span>

                        <span
                          className={`hidden rounded-full px-2 py-0.5 text-[9px] font-bold sm:inline-flex ${priorityStyle.bg} ${priorityStyle.text}`}
                        >
                          {priorityStyle.label}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="mb-1.5 text-[11px] font-medium text-[#99948b]">
                        Order type
                      </p>

                      {getTypeBadge(
                        item.orderType
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    type="button"
                    onClick={() =>
                      markDone(item.id)
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#315d45] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#274c39] active:scale-[0.98] xl:w-auto"
                  >
                    <Check size={15} />
                    Done
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default SmartQueue;