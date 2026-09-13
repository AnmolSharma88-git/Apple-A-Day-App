import { useState } from "react"

import { updateOrderStatus } from "../../../services/orderService"
import { ORDER_STATUS } from "../../../constants/orderStatus"

function OrderStatusControl({ order, onStatusUpdated }) {
  const [loading, setLoading] = useState(false)

  async function handleChange(event) {
    const newStatus = event.target.value

    try {
      setLoading(true)

      const updatedOrder = await updateOrderStatus(
        order.id,
        newStatus
      )

      onStatusUpdated(updatedOrder)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const availableStatuses =
    order.orderType === "DELIVERY"
      ? [
          ORDER_STATUS.PENDING,
          ORDER_STATUS.ACCEPTED,
          ORDER_STATUS.PREPARING,
          ORDER_STATUS.READY,
          ORDER_STATUS.OUT_FOR_DELIVERY,
          ORDER_STATUS.DELIVERED,
        ]
      : [
          ORDER_STATUS.PENDING,
          ORDER_STATUS.ACCEPTED,
          ORDER_STATUS.PREPARING,
          ORDER_STATUS.READY,
          ORDER_STATUS.PICKED_UP,
        ]

  return (
    <select
      value={order.status}
      onChange={handleChange}
      disabled={loading}
      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
    >
      {availableStatuses.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  )
}

export default OrderStatusControl;