const menuItems = [
  {
    name: "Veg Burger",
    price: 80,
    category: "FOOD",
  },
  {
    name: "Paneer Wrap",
    price: 120,
    category: "FOOD",
  },
  {
    name: "Cold Coffee",
    price: 60,
    category: "BEVERAGES",
  },
  {
    name: "French Fries",
    price: 70,
    category: "SNACKS",
  },
  {
    name: "Masala Maggi",
    price: 60,
    category: "FOOD",
  },
  {
    name: "Chocolate Cake",
    price: 90,
    category: "DESSERTS",
  },
]

function createOrder(
  id,
  customerName,
  date,
  hour,
  item,
  quantity,
  orderType,
  status,
  paymentMethod,
  deliveryLocation = ""
) {
  const menuItem = menuItems.find(
    (menuItem) => menuItem.name === item
  )

  const price = menuItem?.price || 0

  return {
    id,
    token: `A${id.slice(-3)}`,
    customerName,

    items: [
      {
        name: item,
        quantity,
        price,
        category:
          menuItem?.category || "FOOD",
      },
    ],

    total: price * quantity,

    orderType,

    status,

    paymentMethod,

    paymentStatus:
      paymentMethod === "QR"
        ? "PAID"
        : "PENDING",

    deliveryLocation,

    createdAt: `${date}T${String(
      hour
    ).padStart(2, "0")}:00:00`,
  }
}

export const analyticsOrders = [
  /* =========================
     JUNE
  ========================= */

  createOrder(
    "AN001",
    "Rahul",
    "2026-06-03",
    10,
    "Veg Burger",
    2,
    "PICKUP",
    "COMPLETED",
    "COD"
  ),

  createOrder(
    "AN002",
    "Priya",
    "2026-06-05",
    13,
    "Paneer Wrap",
    1,
    "DELIVERY",
    "DELIVERED",
    "QR",
    "Girls Hostel"
  ),

  createOrder(
    "AN003",
    "Aman",
    "2026-06-08",
    14,
    "Cold Coffee",
    2,
    "PICKUP",
    "COMPLETED",
    "QR"
  ),

  createOrder(
    "AN004",
    "Neha",
    "2026-06-10",
    16,
    "French Fries",
    2,
    "PICKUP",
    "COMPLETED",
    "COD"
  ),

  createOrder(
    "AN005",
    "Riya",
    "2026-06-12",
    18,
    "Masala Maggi",
    2,
    "DELIVERY",
    "DELIVERED",
    "QR",
    "Boys Hostel"
  ),

  createOrder(
    "AN006",
    "Karan",
    "2026-06-15",
    14,
    "Veg Burger",
    3,
    "PICKUP",
    "COMPLETED",
    "COD"
  ),

  createOrder(
    "AN007",
    "Meera",
    "2026-06-18",
    12,
    "Paneer Wrap",
    2,
    "DELIVERY",
    "DELIVERED",
    "QR",
    "Girls Hostel"
  ),

  createOrder(
    "AN008",
    "Arjun",
    "2026-06-21",
    19,
    "Chocolate Cake",
    1,
    "PICKUP",
    "COMPLETED",
    "QR"
  ),

  createOrder(
    "AN009",
    "Simran",
    "2026-06-24",
    14,
    "Veg Burger",
    2,
    "DELIVERY",
    "DELIVERED",
    "QR",
    "Girls Hostel"
  ),

  createOrder(
    "AN010",
    "Vikas",
    "2026-06-28",
    17,
    "Masala Maggi",
    3,
    "PICKUP",
    "COMPLETED",
    "COD"
  ),

  /* =========================
     JULY
  ========================= */

  createOrder(
    "AN011",
    "Rahul",
    "2026-07-02",
    10,
    "Veg Burger",
    3,
    "PICKUP",
    "COMPLETED",
    "QR"
  ),

  createOrder(
    "AN012",
    "Priya",
    "2026-07-04",
    13,
    "Paneer Wrap",
    2,
    "DELIVERY",
    "DELIVERED",
    "QR",
    "Girls Hostel"
  ),

  createOrder(
    "AN013",
    "Aman",
    "2026-07-07",
    14,
    "Cold Coffee",
    3,
    "PICKUP",
    "COMPLETED",
    "COD"
  ),

  createOrder(
    "AN014",
    "Neha",
    "2026-07-10",
    16,
    "French Fries",
    2,
    "PICKUP",
    "COMPLETED",
    "COD"
  ),

  createOrder(
    "AN015",
    "Riya",
    "2026-07-12",
    18,
    "Masala Maggi",
    2,
    "DELIVERY",
    "DELIVERED",
    "QR",
    "Boys Hostel"
  ),

  createOrder(
    "AN016",
    "Karan",
    "2026-07-15",
    14,
    "Veg Burger",
    4,
    "PICKUP",
    "COMPLETED",
    "QR"
  ),

  createOrder(
    "AN017",
    "Meera",
    "2026-07-18",
    12,
    "Paneer Wrap",
    3,
    "DELIVERY",
    "DELIVERED",
    "QR",
    "Girls Hostel"
  ),

  createOrder(
    "AN018",
    "Arjun",
    "2026-07-20",
    19,
    "Chocolate Cake",
    2,
    "PICKUP",
    "COMPLETED",
    "COD"
  ),

  createOrder(
    "AN019",
    "Simran",
    "2026-07-23",
    14,
    "Veg Burger",
    3,
    "DELIVERY",
    "DELIVERED",
    "QR",
    "Girls Hostel"
  ),

  createOrder(
    "AN020",
    "Vikas",
    "2026-07-26",
    17,
    "Masala Maggi",
    4,
    "PICKUP",
    "COMPLETED",
    "COD"
  ),

  createOrder(
    "AN021",
    "Pooja",
    "2026-07-28",
    13,
    "Cold Coffee",
    3,
    "PICKUP",
    "COMPLETED",
    "QR"
  ),

  createOrder(
    "AN022",
    "Nitin",
    "2026-07-30",
    15,
    "Paneer Wrap",
    2,
    "DELIVERY",
    "DELIVERED",
    "QR",
    "Boys Hostel"
  ),

  /* =========================
     AUGUST
  ========================= */

  createOrder(
    "AN023",
    "Rahul",
    "2026-08-02",
    10,
    "Veg Burger",
    4,
    "PICKUP",
    "COMPLETED",
    "QR"
  ),

  createOrder(
    "AN024",
    "Priya",
    "2026-08-05",
    14,
    "Paneer Wrap",
    3,
    "DELIVERY",
    "DELIVERED",
    "QR",
    "Girls Hostel"
  ),

  createOrder(
    "AN025",
    "Aman",
    "2026-08-08",
    14,
    "Cold Coffee",
    4,
    "PICKUP",
    "COMPLETED",
    "COD"
  ),

  createOrder(
    "AN026",
    "Neha",
    "2026-08-11",
    16,
    "French Fries",
    3,
    "PICKUP",
    "COMPLETED",
    "COD"
  ),

  createOrder(
    "AN027",
    "Riya",
    "2026-08-14",
    18,
    "Masala Maggi",
    3,
    "DELIVERY",
    "DELIVERED",
    "QR",
    "Boys Hostel"
  ),

  createOrder(
    "AN028",
    "Karan",
    "2026-08-16",
    14,
    "Veg Burger",
    5,
    "PICKUP",
    "COMPLETED",
    "QR"
  ),

  createOrder(
    "AN029",
    "Meera",
    "2026-08-19",
    12,
    "Paneer Wrap",
    3,
    "DELIVERY",
    "DELIVERED",
    "QR",
    "Girls Hostel"
  ),

  createOrder(
    "AN030",
    "Arjun",
    "2026-08-21",
    19,
    "Chocolate Cake",
    2,
    "PICKUP",
    "COMPLETED",
    "COD"
  ),

  createOrder(
    "AN031",
    "Simran",
    "2026-08-23",
    14,
    "Veg Burger",
    4,
    "DELIVERY",
    "DELIVERED",
    "QR",
    "Girls Hostel"
  ),

  createOrder(
    "AN032",
    "Vikas",
    "2026-08-25",
    17,
    "Masala Maggi",
    4,
    "PICKUP",
    "COMPLETED",
    "COD"
  ),

  createOrder(
    "AN033",
    "Pooja",
    "2026-08-27",
    13,
    "Cold Coffee",
    4,
    "PICKUP",
    "COMPLETED",
    "QR"
  ),

  createOrder(
    "AN034",
    "Nitin",
    "2026-08-29",
    15,
    "Paneer Wrap",
    3,
    "DELIVERY",
    "DELIVERED",
    "QR",
    "Boys Hostel"
  ),

  /* =========================
     SEPTEMBER
  ========================= */

  createOrder(
    "AN035",
    "Rahul",
    "2026-09-01",
    10,
    "Veg Burger",
    3,
    "PICKUP",
    "COMPLETED",
    "QR"
  ),

  createOrder(
    "AN036",
    "Priya",
    "2026-09-03",
    14,
    "Paneer Wrap",
    4,
    "DELIVERY",
    "DELIVERED",
    "QR",
    "Girls Hostel"
  ),

  createOrder(
    "AN037",
    "Aman",
    "2026-09-05",
    14,
    "Cold Coffee",
    5,
    "PICKUP",
    "COMPLETED",
    "COD"
  ),

  createOrder(
    "AN038",
    "Neha",
    "2026-09-07",
    16,
    "French Fries",
    3,
    "PICKUP",
    "COMPLETED",
    "COD"
  ),

  createOrder(
    "AN039",
    "Riya",
    "2026-09-09",
    18,
    "Masala Maggi",
    4,
    "DELIVERY",
    "DELIVERED",
    "QR",
    "Boys Hostel"
  ),

  createOrder(
    "AN040",
    "Karan",
    "2026-09-10",
    14,
    "Veg Burger",
    5,
    "PICKUP",
    "COMPLETED",
    "QR"
  ),

  createOrder(
    "AN041",
    "Meera",
    "2026-09-11",
    12,
    "Paneer Wrap",
    3,
    "DELIVERY",
    "DELIVERED",
    "QR",
    "Girls Hostel"
  ),

  createOrder(
    "AN042",
    "Arjun",
    "2026-09-12",
    19,
    "Chocolate Cake",
    2,
    "PICKUP",
    "COMPLETED",
    "COD"
  ),
]