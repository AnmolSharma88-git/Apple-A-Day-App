<<<<<<< HEAD
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

import db from "../firebase/firestore";

// Create order
export const createOrder = async (order) => {
  const docRef = await addDoc(
    collection(db, "orders"),
    order
  );

  return docRef.id;
};

// Get all orders
export const getOrders = async () => {
  const snapshot = await getDocs(
    collection(db, "orders")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Update order status
export const updateOrderStatus = async (
  orderId,
  status
) => {
  await updateDoc(
    doc(db, "orders", orderId),
    {
      orderStatus: status,
    }
  );
};

// Update payment status
export const updatePaymentStatus = async (
  orderId,
  status
) => {
  await updateDoc(
    doc(db, "orders", orderId),
    {
      paymentStatus: status,
    }
  );
};
=======
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
>>>>>>> origin/adminpanel
