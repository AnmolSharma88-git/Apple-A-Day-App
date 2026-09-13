export const mockOrders = [
  {
    id: "ORD001",
    token: "A101",
    customerName: "Rahul Sharma",
    items: [
      {
        name: "Veg Burger",
        quantity: 2,
        price: 80,
      },
      {
        name: "Cold Coffee",
        quantity: 1,
        price: 60,
      },
    ],
    total: 220,
    orderType: "PICKUP",
    status: "PENDING",
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    createdAt: "2026-09-13T09:30:00",
  },

  {
    id: "ORD002",
    token: "A102",
    customerName: "Priya Singh",
    items: [
      {
        name: "Paneer Wrap",
        quantity: 1,
        price: 120,
      },
    ],
    total: 120,
    orderType: "DELIVERY",
    status: "PREPARING",
    paymentMethod: "QR",
    paymentStatus: "PAID",
    deliveryLocation: "Girls Hostel",
    createdAt: "2026-09-13T09:35:00",
  },

  {
    id: "ORD003",
    token: "A103",
    customerName: "Aman Verma",
    items: [
      {
        name: "French Fries",
        quantity: 1,
        price: 70,
      },
    ],
    total: 70,
    orderType: "PICKUP",
    status: "READY",
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    createdAt: "2026-09-13T09:40:00",
  },

  {
    id: "ORD004",
    token: "A104",
    customerName: "Neha Thakur",
    items: [
      {
        name: "Masala Maggi",
        quantity: 2,
        price: 60,
      },
    ],
    total: 120,
    orderType: "DELIVERY",
    status: "OUT_FOR_DELIVERY",
    paymentMethod: "QR",
    paymentStatus: "PAID",
    deliveryLocation: "Boys Hostel",
    createdAt: "2026-09-13T09:45:00",
  },
]