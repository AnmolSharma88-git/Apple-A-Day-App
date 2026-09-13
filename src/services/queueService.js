import { mockOrders } from "../mock/orders"

function calculateOrderAge(createdAt) {
  const created = new Date(createdAt).getTime()
  const now = Date.now()

  return Math.max(
    0,
    Math.floor((now - created) / (1000 * 60))
  )
}

function calculatePriorityScore(order) {
  const orderAge = calculateOrderAge(order.createdAt)

  const preparationTime =
    order.items?.reduce(
      (total, item) => total + Number(item.quantity || 1),
      0
    ) || 1

  const deliveryPriority =
    order.orderType === "DELIVERY" ? 10 : 0

  const score =
    orderAge * 2 +
    preparationTime * 5 +
    deliveryPriority

  return Math.min(100, score)
}

export function getQueueOrders() {
  const activeStatuses = [
    "PENDING",
    "ACCEPTED",
    "PREPARING",
  ]

  const queueOrders = mockOrders
    .filter((order) =>
      activeStatuses.includes(order.status)
    )
    .map((order) => ({
      ...order,
      orderAge: calculateOrderAge(order.createdAt),
      preparationTime:
        order.items?.reduce(
          (total, item) =>
            total + Number(item.quantity || 1),
          0
        ) || 1,
      priorityScore: calculatePriorityScore(order),
    }))
    .sort(
      (a, b) =>
        b.priorityScore - a.priorityScore
    )

  return Promise.resolve(queueOrders)
}