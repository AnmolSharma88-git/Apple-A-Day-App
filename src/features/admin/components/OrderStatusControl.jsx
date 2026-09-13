import { useState } from "react"
import {
  ArrowRight,
  Bike,
  Check,
  ChefHat,
  PackageCheck,
} from "lucide-react"

import { updateOrderStatus } from "../../../services/orderService"
import { ORDER_STATUS } from "../../../constants/orderStatus"
import { ORDER_TYPES } from "../../../constants/orderTypes"

function OrderStatusControl({
  order,
  onStatusUpdated,
}) {
  const [loading, setLoading] = useState(false)

  async function handleStatusChange(newStatus) {
    try {
      setLoading(true)

      const updatedOrder =
        await updateOrderStatus(
          order.id,
          newStatus
        )

      onStatusUpdated(updatedOrder)
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error
      )
    } finally {
      setLoading(false)
    }
  }

  const nextAction = getNextAction(order)

  if (!nextAction) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#eef5ef] px-3 py-2 text-[10px] font-bold text-[#52705d]">
        <Check size={13} />
        Order completed
      </span>
    )
  }

  const Icon = nextAction.icon

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() =>
        handleStatusChange(nextAction.status)
      }
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#315d45] px-4 py-2.5 text-[10px] font-bold text-white shadow-sm transition hover:bg-[#274c39] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
    >
      {loading ? (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      ) : (
        <Icon size={14} />
      )}

      {loading
        ? "Updating..."
        : nextAction.label}

      {!loading && (
        <ArrowRight size={13} />
      )}
    </button>
  )
}

function getNextAction(order) {
  const { status, orderType } = order

  if (status === ORDER_STATUS.PENDING) {
    return {
      status: ORDER_STATUS.ACCEPTED,
      label: "Accept Order",
      icon: Check,
    }
  }

  if (status === ORDER_STATUS.ACCEPTED) {
    return {
      status: ORDER_STATUS.PREPARING,
      label: "Start Preparing",
      icon: ChefHat,
    }
  }

  if (status === ORDER_STATUS.PREPARING) {
    return {
      status: ORDER_STATUS.READY,
      label: "Mark Ready",
      icon: PackageCheck,
    }
  }

  if (
    status === ORDER_STATUS.READY &&
    orderType === ORDER_TYPES.PICKUP
  ) {
    return {
      status: ORDER_STATUS.PICKED_UP,
      label: "Mark Picked Up",
      icon: Check,
    }
  }

  if (
    status === ORDER_STATUS.READY &&
    orderType === ORDER_TYPES.DELIVERY
  ) {
    return {
      status: ORDER_STATUS.OUT_FOR_DELIVERY,
      label: "Send for Delivery",
      icon: Bike,
    }
  }

  if (
    status === ORDER_STATUS.OUT_FOR_DELIVERY
  ) {
    return {
      status: ORDER_STATUS.DELIVERED,
      label: "Mark Delivered",
      icon: Check,
    }
  }

  return null
}

export default OrderStatusControl;