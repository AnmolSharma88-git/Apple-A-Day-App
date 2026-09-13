import { useState } from "react";

import {
    loginUser,
    logoutUser,
} from "../../../services/authService";

export default function LoginForm({
    selectedRole,
    onSuccess,
}) {
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!email.trim() || !password) {
            setError(
                "Please enter your email and password."
            );

            return;
        }

        try {
            setLoading(true);

            const result = await loginUser(
                email.trim(),
                password
            );

            /*
              IMPORTANT
      
              Selecting "Admin" does NOT make someone admin.
      
              We check the role that already exists
              in the user's account.
            */

            if (
                result.profile.role !== selectedRole
            ) {
                await logoutUser();

                if (selectedRole === "admin") {
                    setError(
                        "This account is not an admin account."
                    );
                } else {
                    setError(
                        "This account is not a student account."
                    );
                }

                return;
            }

            onSuccess?.(result);

        } catch (error) {
            console.error(error);

            if (
                error.code === "auth/invalid-credential" ||
                error.code === "auth/user-not-found" ||
                error.code === "auth/wrong-password"
            ) {
                setError(
                    "Incorrect email or password."
                );
            } else {
                setError(
                    error.message || "Login failed."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>

            <h2>
                {selectedRole === "admin"
                    ? "Admin Login"
                    : "Student Login"}
            </h2>


            <label>
                Gmail
            </label>

            <input
                type="email"
                value={email}
                onChange={(event) =>
                    setEmail(event.target.value)
                }
                placeholder="example@gmail.com"
            />


            <label>
                Password
            </label>

            <input
                type="password"
                value={password}
                onChange={(event) =>
                    setPassword(event.target.value)
                }
                placeholder="Password"
            />


            {error && (
                <p>{error}</p>
            )}


            <button
                type="submit"
                disabled={loading}
            >
                {loading
                    ? "Logging in..."
                    : "Login"}
            </button>

        </form>
    );
}