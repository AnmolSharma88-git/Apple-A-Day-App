import { useState } from "react";

import LoginForm from "../components/LoginForm";

export default function Login() {

    const [role, setRole] = useState("student");

    const handleSuccess = ({ profile }) => {

        if (profile.role === "admin") {
            window.location.href = "/admin";
        } else {
            window.location.href = "/student";
        }
    };

    return (
        <main>

            <h1>Apple A Day</h1>

            {/* Choose LOGIN type */}

            <div>

                <button
                    type="button"
                    onClick={() => setRole("student")}
                >
                    Student
                </button>

                <button
                    type="button"
                    onClick={() => setRole("admin")}
                >
                    Admin
                </button>

            </div>


            <LoginForm
                selectedRole={role}
                onSuccess={handleSuccess}
            />


            {/* Only students see registration */}

            {role === "student" && (
                <p>
                    Don't have an account?

                    <a href="/register">
                        Create Student Account
                    </a>
                </p>
            )}


            {/* No admin registration */}

            {role === "admin" && (
                <p>
                    Admin accounts are privately created
                    by the authorized administrator.
                </p>
            )}

        </main>
    );
}