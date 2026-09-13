import { mockOrders } from "../mock/orders"

export function getAllOrders() {
  return Promise.resolve(mockOrders)
}

export function getOrderById(orderId) {
  const order = mockOrders.find(
    (order) => order.id === orderId
  )

  return Promise.resolve(order || null)
}

export function updateOrderStatus(orderId, newStatus) {
  const order = mockOrders.find(
    (order) => order.id === orderId
  )

  if (!order) {
    return Promise.reject(
      new Error("Order not found")
    )
  }

  order.status = newStatus

  return Promise.resolve(order)
}