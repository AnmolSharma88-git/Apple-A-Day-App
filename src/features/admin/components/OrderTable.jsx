import {
  Bike,
  Clock3,
  Mail,
  Package,
  Phone,
  ShoppingBag,
} from "lucide-react"

import OrderStatusControl from "./OrderStatusControl"
import { ORDER_TYPES } from "../../../constants/orderTypes"

function OrderTable({
  orders,
  onOrderUpdated,
}) {
  return (
    <div className="space-y-4">

      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onOrderUpdated={onOrderUpdated}
        />
      ))}

    </div>
  )
}

function OrderCard({
  order,
  onOrderUpdated,
}) {
  const isDelivery =
    order.orderType === ORDER_TYPES.DELIVERY

  return (
    <article className="overflow-hidden rounded-2xl border border-[#e6e1d7] bg-white shadow-sm transition hover:border-[#d5cec0] hover:shadow-md">

      {/* HEADER */}

      <div className="flex flex-col gap-3 border-b border-[#eeeae2] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#193528] text-[10px] font-bold text-white">
            {order.token}
          </div>

          <div className="min-w-0">

            <div className="flex min-w-0 flex-wrap items-center gap-2">

              <h2 className="max-w-full truncate text-sm font-bold text-[#193528] sm:text-base">
                {order.customerName}
              </h2>

              <span className="rounded-md bg-[#eef2ed] px-2 py-1 text-[9px] font-bold text-[#52705d]">
                #{order.id}
              </span>

            </div>

            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#858078]">

              <Clock3 size={12} />

              {formatOrderTime(order.createdAt)}

            </div>

          </div>

        </div>

        <div className="flex flex-wrap items-center gap-2">

          <StatusBadge
            status={order.status}
          />

          <TypeBadge
            type={order.orderType}
          />

        </div>

      </div>

      {/* BODY */}

      <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_170px]">

        {/* ITEMS */}

        <div className="min-w-0 rounded-xl border border-[#eee9df] bg-[#faf8f3] p-3 sm:p-4">

          <div className="mb-3 flex items-center justify-between">

            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#68796e]">
              Ordered Items
            </p>

            <span className="text-[9px] font-medium text-[#99948b]">
              {order.items?.length || 0} items
            </span>

          </div>

          <div className="space-y-2">

            {order.items?.map((item, index) => (
              <div
                key={`${order.id}-${index}`}
                className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-[#eeeae2] bg-white px-3 py-2.5"
              >

                <div className="flex min-w-0 items-center gap-2.5">

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f5f1e9] text-[#315d45]">
                    <Package size={13} />
                  </div>

                  <span className="truncate text-xs font-semibold text-[#44413b]">
                    {item.name}
                  </span>

                </div>

                <span className="shrink-0 text-[9px] font-medium text-[#77736b]">
                  {item.quantity} × ₹{item.price}
                </span>

              </div>
            ))}

          </div>

        </div>

        {/* TOTAL */}

        <div className="rounded-xl border border-[#dbe6de] bg-[#eef5ef] p-4">

          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#62816c]">
            Order Total
          </p>

          <p className="mt-1 text-2xl font-bold tracking-tight text-[#193528]">
            ₹{order.total}
          </p>

          <div className="mt-5">

            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#78907d]">
              Payment
            </p>

            <p className="mt-1 text-[10px] font-bold text-[#52705d]">
              {order.paymentMethod || "COD"}
              {" · "}
              {order.paymentStatus || "PENDING"}
            </p>

          </div>

        </div>

      </div>

      {/* DETAILS */}

      {(order.email ||
        order.phone ||
        order.deliveryLocation) && (
        <div className="border-t border-[#eeeae2] px-4 py-3.5 sm:px-5">

          <div className="flex flex-wrap gap-2">

            {order.email && (
              <InfoChip
                icon={Mail}
                text={order.email}
              />
            )}

            {order.phone && (
              <InfoChip
                icon={Phone}
                text={order.phone}
              />
            )}

            {isDelivery &&
              order.deliveryLocation && (
                <InfoChip
                  icon={Bike}
                  text={order.deliveryLocation}
                  highlighted
                />
              )}

          </div>

        </div>
      )}

      {/* ACTION */}

      <div className="flex flex-col gap-3 border-t border-[#eeeae2] bg-[#fdfbf7] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">

        <div className="flex items-center gap-2 text-[10px] font-medium text-[#77736b]">

          {isDelivery ? (
            <Bike size={13} />
          ) : (
            <ShoppingBag size={13} />
          )}

          <span>
            {isDelivery
              ? "Campus delivery"
              : "Café pickup"}
          </span>

        </div>

        <div className="w-full sm:w-auto">
          <OrderStatusControl
            order={order}
            onStatusUpdated={onOrderUpdated}
          />
        </div>

      </div>

    </article>
  )
}

function InfoChip({
  icon: Icon,
  text,
  highlighted = false,
}) {
  return (
    <div
      className={`inline-flex max-w-full items-center gap-2 rounded-lg px-3 py-2 text-[9px] font-medium ${
        highlighted
          ? "bg-[#eef4f0] text-[#52705d]"
          : "bg-[#f5f2ec] text-[#6d6961]"
      }`}
    >
      <Icon size={12} />

      <span className="truncate">
        {text}
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
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[9px] font-bold ${
        styles[status] ||
        "border-stone-200 bg-stone-50 text-stone-600"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />

      {labels[status] || status}
    </span>
  )
}

function TypeBadge({ type }) {
  const isDelivery =
    type === ORDER_TYPES.DELIVERY

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[9px] font-bold ${
        isDelivery
          ? "border-sky-200 bg-sky-50 text-sky-700"
          : "border-amber-200 bg-amber-50 text-amber-700"
      }`}
    >
      {isDelivery ? (
        <Bike size={12} />
      ) : (
        <ShoppingBag size={12} />
      )}

      {isDelivery
        ? "Delivery"
        : "Pickup"}
    </span>
  )
}

function formatOrderTime(createdAt) {
  if (!createdAt) {
    return "Time unavailable"
  }

  const date = new Date(createdAt)

  if (Number.isNaN(date.getTime())) {
    return "Time unavailable"
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })
}

export default OrderTable;