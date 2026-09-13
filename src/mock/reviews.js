export const mockReviews = [
  {
    id: "REV001",
    customer: {
      id: "USER-009",
      name: "Rahul",
      email: "rahul@example.com",
      phone: "+91 98765 43218",
    },
    orderId: "ORD-0980",
    rating: 5,
    comment:
      "The food was great and the service was very quick.",
    date: "2026-08-15",

    read: false,
    replied: false,

    adminReply: "",
    repliedAt: null,
  },

  {
    id: "REV002",
    customer: {
      id: "USER-010",
      name: "Sneha",
      email: "sneha@example.com",
      phone: "+91 98765 43219",
    },
    orderId: "ORD-0975",
    rating: 4,
    comment:
      "Good food. Waiting time was slightly high.",
    date: "2026-08-14",

    read: false,
    replied: false,

    adminReply: "",
    repliedAt: null,
  },

  {
    id: "REV003",
    customer: {
      id: "USER-011",
      name: "Vikram",
      email: "vikram@example.com",
      phone: "+91 98765 43220",
    },
    orderId: "ORD-0968",
    rating: 3,
    comment:
      "Pizza was good but coffee was unavailable.",
    date: "2026-08-13",

    read: true,
    replied: true,

    adminReply:
      "Thank you for your feedback. We are working on improving item availability.",
    repliedAt: "2026-08-13T14:30:00",
  },

  {
    id: "REV004",
    customer: {
      id: "USER-012",
      name: "Meera",
      email: "meera@example.com",
      phone: "+91 98765 43221",
    },
    orderId: "ORD-0960",
    rating: 5,
    comment:
      "Loved the food and the café atmosphere.",
    date: "2026-08-12",

    read: true,
    replied: false,

    adminReply: "",
    repliedAt: null,
  },
]