import { Navigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export default function RoleRoute({
    requiredRole,
    children,
}) {

    const {
        profile,
        loading,
    } = useAuth();


    if (loading) {
        return <p>Loading...</p>;
    }


    if (!profile) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    if (profile.role !== requiredRole) {
        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }


    return children;
}