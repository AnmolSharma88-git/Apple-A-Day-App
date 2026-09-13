import { useEffect, useState } from "react"

import StatsCard from "../components/StatsCard"

import {
  getAllOrders,
} from "../../../services/orderService"

import { ORDER_STATUS } from "../../../constants/orderStatus"
import { ORDER_TYPES } from "../../../constants/orderTypes"

function Dashboard() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    async function loadOrders() {
      const data = await getAllOrders()
      setOrders(data)
    }

    loadOrders()
  }, [])

  const completedOrders = orders.filter(
    (order) =>
      order.status === ORDER_STATUS.PICKED_UP ||
      order.status === ORDER_STATUS.DELIVERED
  )

  const pendingOrders = orders.filter(
    (order) =>
      order.status === ORDER_STATUS.PENDING
  )

  const preparingOrders = orders.filter(
    (order) =>
      order.status === ORDER_STATUS.PREPARING
  )

  const pickupOrders = orders.filter(
    (order) =>
      order.orderType === ORDER_TYPES.PICKUP
  )

  const deliveryOrders = orders.filter(
    (order) =>
      order.orderType === ORDER_TYPES.DELIVERY
  )

  const revenue = completedOrders.reduce(
    (total, order) =>
      total + Number(order.total || 0),
    0
  )

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Overview of café operations.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Orders"
          value={orders.length}
        />

        <StatsCard
          title="Pending"
          value={pendingOrders.length}
        />

        <StatsCard
          title="Preparing"
          value={preparingOrders.length}
        />

        <StatsCard
          title="Completed"
          value={completedOrders.length}
        />

        <StatsCard
          title="Pickup"
          value={pickupOrders.length}
        />

        <StatsCard
          title="Delivery"
          value={deliveryOrders.length}
        />

        <StatsCard
          title="Revenue"
          value={`₹${revenue}`}
        />
      </div>
    </section>
  )
}

export default Dashboard;