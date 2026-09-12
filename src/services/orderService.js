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