import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase/auth";
import { getUserProfile } from "../services/authService";

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            async (firebaseUser) => {
                try {
                    if (!firebaseUser) {
                        setUser(null);
                        setProfile(null);
                        setLoading(false);
                        return;
                    }

                    const userProfile = await getUserProfile(
                        firebaseUser.uid
                    );

                    setUser(firebaseUser);
                    setProfile(userProfile);
                } catch (error) {
                    console.error(error);

                    setUser(null);
                    setProfile(null);
                } finally {
                    setLoading(false);
                }
            }
        );

        return unsubscribe;
    }, []);

    return {
        user,
        profile,
        loading,

        isAuthenticated: !!user,

        isAdmin: profile?.role === "admin",

        isStudent: profile?.role === "student",
    };
};