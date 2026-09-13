import { useState } from "react";
import { registerStudent } from "../../../services/authService";

const initialForm = {
    name: "",
    email: "",
    phone: "",
    password: "",
};

const validateForm = (form) => {
    const errors = {};

    // Name
    if (form.name.trim().length < 2) {
        errors.name = "Name must contain at least 2 characters.";
    }

    // Gmail
    if (
        !/^[A-Za-z0-9._%+-]+@gmail\.com$/i.test(
            form.email.trim()
        )
    ) {
        errors.email = "Enter a valid Gmail address.";
    }

    // Indian phone number
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
        errors.phone =
            "Enter a valid 10-digit Indian phone number.";
    }

    // Password
    if (form.password.length < 8) {
        errors.password =
            "Password must contain at least 8 characters.";
    } else if (!/[A-Z]/.test(form.password)) {
        errors.password =
            "Password must contain an uppercase letter.";
    } else if (!/[a-z]/.test(form.password)) {
        errors.password =
            "Password must contain a lowercase letter.";
    } else if (!/\d/.test(form.password)) {
        errors.password =
            "Password must contain a number.";
    }

    return errors;
};

export default function RegisterForm({ onSuccess }) {
    const [form, setForm] = useState(initialForm);

    const [errors, setErrors] = useState({});

    const [serverError, setServerError] = useState("");

    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));

        setErrors((current) => ({
            ...current,
            [name]: "",
        }));

        setServerError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationErrors = validateForm(form);

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        try {
            setLoading(true);

            await registerStudent(form);

            setForm(initialForm);

            onSuccess?.();

        } catch (error) {
            console.error(error);

            if (
                error.code === "auth/email-already-in-use"
            ) {
                setServerError(
                    "This Gmail is already registered."
                );
            } else if (
                error.code === "auth/weak-password"
            ) {
                setServerError(
                    "Password is too weak."
                );
            } else {
                setServerError(
                    error.message || "Registration failed."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>

            <h2>Create Student Account</h2>

            <label>
                Full Name
            </label>

            <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
            />

            {errors.name && (
                <p>{errors.name}</p>
            )}


            <label>
                Gmail
            </label>

            <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
            />

            {errors.email && (
                <p>{errors.email}</p>
            )}


            <label>
                Phone Number
            </label>

            <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
                inputMode="numeric"
                placeholder="10-digit phone number"
            />

            {errors.phone && (
                <p>{errors.phone}</p>
            )}


            <label>
                Password
            </label>

            <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
            />

            {errors.password && (
                <p>{errors.password}</p>
            )}


            {serverError && (
                <p>{serverError}</p>
            )}


            <button
                type="submit"
                disabled={loading}
            >
                {loading
                    ? "Creating Account..."
                    : "Create Student Account"}
            </button>

        </form>
    );
}