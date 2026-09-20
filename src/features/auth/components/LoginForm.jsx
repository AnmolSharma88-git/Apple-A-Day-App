import { useState } from "react";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    // Firebase authentication will be added here later.
    console.log("Login data:", formData);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl md:grid md:grid-cols-2">

        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-red-500 via-red-600 to-orange-500 p-10 text-white">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl backdrop-blur-sm">
                🍎
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  Apple-A-Day
                </h1>

                <p className="text-sm text-red-100">
                  Campus Café
                </p>
              </div>
            </div>

            <h2 className="max-w-sm text-4xl font-bold leading-tight">
              Your campus café, just a tap away.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-6 text-red-100">
              Order your favourite meals, track your orders and skip the
              waiting queue with Apple-A-Day.
            </p>
          </div>

          <p className="text-sm text-red-100">
            🍽️ Simple. Fast. Campus-friendly.
          </p>
        </div>

        {/* Right Section */}
        <div className="p-7 sm:p-10">
          <div className="mx-auto max-w-md">

            {/* Mobile Logo */}
            <div className="mb-8 flex items-center gap-3 md:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500 text-xl">
                🍎
              </div>

              <div>
                <h1 className="font-bold text-white">
                  Apple-A-Day
                </h1>

                <p className="text-xs text-zinc-400">
                  Campus Café
                </p>
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-2 text-sm font-medium text-red-400">
                Welcome back
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-white">
                Sign in
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                Sign in to continue to your Apple-A-Day account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-zinc-300"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-medium text-red-400 transition hover:text-red-300"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 pr-20 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-400 transition hover:text-white"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-xl bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-600 active:scale-[0.99]"
              >
                Sign in
              </button>
            </form>

            {/* Register */}
            <p className="mt-7 text-center text-sm text-zinc-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-red-400 transition hover:text-red-300"
              >
                Create one
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;