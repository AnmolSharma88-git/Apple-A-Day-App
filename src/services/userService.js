import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import db from "../firebase/firestore";

// Save user
export const saveUser = async (uid, userData) => {
  await setDoc(doc(db, "users", uid), userData);
};

// Get one user
export const getUser = async (uid) => {
  const userRef = doc(db, "users", uid);

  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  }

  return null;
};

// Update user
export const updateUser = async (uid, data) => {
  await updateDoc(doc(db, "users", uid), data);
};