import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import db from "../firebase/firestore";

// Add menu item
export const addMenuItem = async (menuItem) => {
  const docRef = await addDoc(
    collection(db, "menu"),
    menuItem
  );

  return docRef.id;
};

// Get all menu items
export const getMenuItems = async () => {
  const snapshot = await getDocs(
    collection(db, "menu")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Update menu item
export const updateMenuItem = async (id, data) => {
  await updateDoc(
    doc(db, "menu", id),
    data
  );
};

// Delete menu item
export const deleteMenuItem = async (id) => {
  await deleteDoc(
    doc(db, "menu", id)
  );
};