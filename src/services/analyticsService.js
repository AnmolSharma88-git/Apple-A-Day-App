import { mockOrders } from "../mock/orders"
import { analyticsOrders } from "../mock/analyticsOrders"

const allOrders = [
  ...analyticsOrders,
  ...mockOrders,
]

const STATUS_LABELS = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  PREPARING: "Preparing",
  READY: "Ready",
  PICKED_UP: "Picked Up",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
}

/* =========================================================
   MAIN ANALYTICS FUNCTION
========================================================= */

export async function getAnalyticsData(
  filters = {}
) {
  const {
    startDate,
    endDate,
    orderType = "ALL",
    category = "ALL",
    item = "ALL",
  } = filters

  let orders = [...allOrders]

  /* =========================
     DATE
  ========================= */

  if (startDate) {
    const start = new Date(
      `${startDate}T00:00:00`
    ).getTime()

    orders = orders.filter(
      (order) =>
        new Date(order.createdAt).getTime() >=
        start
    )
  }

  if (endDate) {
    const end = new Date(
      `${endDate}T23:59:59`
    ).getTime()

    orders = orders.filter(
      (order) =>
        new Date(order.createdAt).getTime() <=
        end
    )
  }

  /* =========================
     ORDER TYPE
  ========================= */

  if (orderType !== "ALL") {
    orders = orders.filter(
      (order) =>
        order.orderType === orderType
    )
  }

  /* =========================
     CATEGORY
  ========================= */

  if (category !== "ALL") {
    orders = orders.filter((order) =>
      order.items?.some(
        (orderItem) =>
          orderItem.category === category
      )
    )
  }

  /* =========================
     ITEM
  ========================= */

  if (item !== "ALL") {
    orders = orders.filter((order) =>
      order.items?.some(
        (orderItem) =>
          orderItem.name === item
      )
    )
  }

  return {
    overview:
      buildOverview(orders),

    operations:
      buildOperations(orders),

    revenueTrend:
      buildRevenueTrend(orders),

    peakHours:
      buildPeakHours(orders),

    busiestDays:
      buildBusiestDays(orders),

    orderTypeData:
      buildOrderTypeData(orders),

    statusData:
      buildStatusData(orders),

    popularItems:
      buildPopularItems(orders),

    leastItems:
      buildLeastItems(orders),

    categoryRevenue:
      buildCategoryRevenue(orders),

    categoryItems:
      buildCategoryItems(orders),

    paymentData:
      buildPaymentData(orders),

    menuAvailability:
      buildMenuAvailability(),
  }
}

/* =========================================================
   OVERVIEW
========================================================= */

function buildOverview(orders) {
  const totalRevenue = orders.reduce(
    (sum, order) =>
      sum + Number(order.total || 0),
    0
  )

  const totalOrders = orders.length

  const completedOrders =
    orders.filter((order) =>
      [
        "COMPLETED",
        "PICKED_UP",
        "DELIVERED",
      ].includes(order.status)
    ).length

  const averageOrderValue =
    totalOrders > 0
      ? totalRevenue / totalOrders
      : 0

  const completionRate =
    totalOrders > 0
      ? (completedOrders / totalOrders) * 100
      : 0

  return {
    totalRevenue,
    totalOrders,
    completedOrders,
    averageOrderValue,
    completionRate,
  }
}

/* =========================================================
   OPERATIONS
========================================================= */

function buildOperations(orders) {
  const pendingOrders =
    orders.filter(
      (order) =>
        order.status === "PENDING"
    ).length

  const activeOrders =
    orders.filter((order) =>
      [
        "PENDING",
        "ACCEPTED",
        "PREPARING",
        "READY",
        "OUT_FOR_DELIVERY",
      ].includes(order.status)
    ).length

  const pickupOrders =
    orders.filter(
      (order) =>
        order.orderType === "PICKUP"
    ).length

  const deliveryOrders =
    orders.filter(
      (order) =>
        order.orderType === "DELIVERY"
    ).length

  const deliveredOrders =
    orders.filter(
      (order) =>
        order.status === "DELIVERED"
    ).length

  const deliveryCompletionRate =
    deliveryOrders > 0
      ? (deliveredOrders /
          deliveryOrders) *
        100
      : 0

  return {
    pendingOrders,
    activeOrders,
    pickupOrders,
    deliveryOrders,
    deliveredOrders,
    deliveryCompletionRate,
  }
}

/* =========================================================
   REVENUE TREND
========================================================= */

function buildRevenueTrend(orders) {
  const grouped = {}

  orders.forEach((order) => {
    const date =
      order.createdAt.split("T")[0]

    if (!grouped[date]) {
      grouped[date] = {
        date,
        revenue: 0,
        orders: 0,
      }
    }

    grouped[date].revenue += Number(
      order.total || 0
    )

    grouped[date].orders += 1
  })

  return Object.values(grouped)
    .sort((a, b) =>
      a.date.localeCompare(b.date)
    )
    .map((item) => ({
      ...item,
      date: formatDate(item.date),
    }))
}

/* =========================================================
   PEAK HOURS
========================================================= */

function buildPeakHours(orders) {
  const grouped = {}

  orders.forEach((order) => {
    const hour = new Date(
      order.createdAt
    ).getHours()

    if (!grouped[hour]) {
      grouped[hour] = {
        hour,
        count: 0,
      }
    }

    grouped[hour].count += 1
  })

  return Object.values(grouped).sort(
    (a, b) => a.hour - b.hour
  )
}

/* =========================================================
   BUSIEST DAYS
========================================================= */

function buildBusiestDays(orders) {
  const grouped = {}

  orders.forEach((order) => {
    const date =
      order.createdAt.split("T")[0]

    if (!grouped[date]) {
      grouped[date] = {
        date,
        count: 0,
      }
    }

    grouped[date].count += 1
  })

  return Object.values(grouped)
    .sort((a, b) =>
      a.date.localeCompare(b.date)
    )
    .map((item) => ({
      ...item,
      date: formatDate(item.date),
    }))
}

/* =========================================================
   ORDER TYPE
========================================================= */

function buildOrderTypeData(orders) {
  const pickup = orders.filter(
    (order) =>
      order.orderType === "PICKUP"
  ).length

  const delivery = orders.filter(
    (order) =>
      order.orderType === "DELIVERY"
  ).length

  return [
    {
      type: "PICKUP",
      count: pickup,
    },
    {
      type: "DELIVERY",
      count: delivery,
    },
  ].filter((item) => item.count > 0)
}

/* =========================================================
   STATUS
========================================================= */

function buildStatusData(orders) {
  const statusCounts = {}

  orders.forEach((order) => {
    if (!statusCounts[order.status]) {
      statusCounts[order.status] = 0
    }

    statusCounts[order.status] += 1
  })

  return Object.entries(statusCounts)
    .map(([status, count]) => ({
      status,
      label:
        STATUS_LABELS[status] ||
        formatLabel(status),
      count,
    }))
    .sort(
      (a, b) => b.count - a.count
    )
}

/* =========================================================
   POPULAR ITEMS
========================================================= */

function buildPopularItems(orders) {
  const grouped = {}

  orders.forEach((order) => {
    order.items?.forEach((item) => {
      if (!grouped[item.name]) {
        grouped[item.name] = {
          name: item.name,
          quantity: 0,
          revenue: 0,
          category:
            item.category || "FOOD",
        }
      }

      grouped[item.name].quantity +=
        Number(item.quantity || 0)

      grouped[item.name].revenue +=
        Number(item.price || 0) *
        Number(item.quantity || 0)
    })
  })

  return Object.values(grouped).sort(
    (a, b) =>
      b.quantity - a.quantity
  )
}

/* =========================================================
   LEAST ITEMS
========================================================= */

function buildLeastItems(orders) {
  return [...buildPopularItems(orders)]
    .sort(
      (a, b) =>
        a.quantity - b.quantity
    )
}

/* =========================================================
   CATEGORY REVENUE
========================================================= */

function buildCategoryRevenue(orders) {
  const grouped = {}

  orders.forEach((order) => {
    order.items?.forEach((item) => {
      const category =
        item.category || "FOOD"

      if (!grouped[category]) {
        grouped[category] = {
          category,
          revenue: 0,
          quantity: 0,
        }
      }

      grouped[category].revenue +=
        Number(item.price || 0) *
        Number(item.quantity || 0)

      grouped[category].quantity +=
        Number(item.quantity || 0)
    })
  })

  return Object.values(grouped).sort(
    (a, b) =>
      b.revenue - a.revenue
  )
}

/* =========================================================
   TOP ITEM IN EACH CATEGORY
========================================================= */

function buildCategoryItems(orders) {
  const categories = {}

  orders.forEach((order) => {
    order.items?.forEach((item) => {
      const category =
        item.category || "FOOD"

      if (!categories[category]) {
        categories[category] = {}
      }

      if (!categories[category][item.name]) {
        categories[category][item.name] =
          {
            name: item.name,
            quantity: 0,
            revenue: 0,
          }
      }

      categories[category][
        item.name
      ].quantity += Number(
        item.quantity || 0
      )

      categories[category][
        item.name
      ].revenue +=
        Number(item.price || 0) *
        Number(item.quantity || 0)
    })
  })

  return Object.entries(categories)
    .map(
      ([category, items]) => {
        const sortedItems =
          Object.values(items).sort(
            (a, b) =>
              b.quantity - a.quantity
          )

        return {
          category,
          topItem:
            sortedItems[0] || null,
          items: sortedItems,
        }
      }
    )
}

/* =========================================================
   PAYMENT
========================================================= */

function buildPaymentData(orders) {
  const grouped = {}

  orders.forEach((order) => {
    const method =
      order.paymentMethod || "COD"

    if (!grouped[method]) {
      grouped[method] = 0
    }

    grouped[method] += 1
  })

  return Object.entries(grouped)
    .map(([method, count]) => ({
      method,
      count,
    }))
    .sort(
      (a, b) => b.count - a.count
    )
}

/* =========================================================
   MENU AVAILABILITY
========================================================= */

function buildMenuAvailability() {
  return {
    available: 5,
    unavailable: 1,
  }
}

/* =========================================================
   HELPERS
========================================================= */

function formatDate(dateString) {
  const date = new Date(
    `${dateString}T00:00:00`
  )

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
    }
  )
}

function formatLabel(value) {
  if (!value) {
    return ""
  }

  return String(value)
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    )
}