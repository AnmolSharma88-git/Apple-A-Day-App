import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth } from "../firebase/auth";
import { db } from "../firebase/firestore";

/*
  STUDENT REGISTRATION

  Important:
  We DO NOT accept a role from the frontend.

  Every account created through public registration
  automatically becomes a student.
*/

export const registerStudent = async ({
  name,
  email,
  phone,
  password,
}) => {
  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = result.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name: name.trim(),
    email: user.email,
    phone: phone.trim(),

    // NEVER take this from the user
    role: "student",

    createdAt: serverTimestamp(),
  });

  return user;
};


/*
  LOGIN

  Firebase checks:
  email + password

  Then we get the user's profile from Firestore
  to determine whether they are a student or admin.
*/

export const loginUser = async (email, password) => {
  const result = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = result.user;

  const profileSnapshot = await getDoc(
    doc(db, "users", user.uid)
  );

  if (!profileSnapshot.exists()) {
    await signOut(auth);
    throw new Error("User profile not found.");
  }

  return {
    user,
    profile: profileSnapshot.data(),
  };
};


/*
  GET USER PROFILE
*/

export const getUserProfile = async (uid) => {
  const profileSnapshot = await getDoc(
    doc(db, "users", uid)
  );

  if (!profileSnapshot.exists()) {
    return null;
  }

  return profileSnapshot.data();
};


/*
  LOGOUT
*/

export const logoutUser = async () => {
  await signOut(auth);
};