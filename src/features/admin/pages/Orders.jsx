import { useEffect, useState } from "react"

import OrderTable from "../components/OrderTable"
import { getAllOrders } from "../../../services/orderService"

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getAllOrders()
        setOrders(data)
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

  if (loading) {
    return <p>Loading orders...</p>
  }

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Orders
        </h1>

        <p className="mt-2 text-slate-500">
          Manage customer orders.
        </p>
      </div>

      <OrderTable
        orders={orders}
        onOrderUpdated={handleOrderUpdated}
      />
    </section>
  )
}

export default Orders;