import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function StudentNavbar() {
  const cartItems = useSelector((state) => state.cart.items);

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const logoUrl =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyceNzPWrawPJA5Hz37lRgNj_pGz5x0JFd7SCfNQ34dQ&s";

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-2">
        <div className="flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt="Apple A Day"
              className="w-16 h-16 object-contain"
            />

            <div className="leading-tight">
              <h1 className="text-2xl font-bold text-gray-800">
                Apple A Day
              </h1>

              <p className="text-sm text-gray-500">
                Campus Goodness, Every Day
              </p>
            </div>
          </Link>

          {/* NAVIGATION */}
          <div className="flex items-center gap-7">

            <Link
              to="/"
              className="text-gray-700 font-medium hover:text-green-600 transition"
            >
              Home
            </Link>

            <Link
              to="/menu"
              className="text-gray-700 font-medium hover:text-green-600 transition"
            >
              Menu
            </Link>

            <Link
              to="/cabin-booking"
              className="text-gray-700 font-medium hover:text-green-600 transition"
            >
              Cabin Booking
            </Link>

            {/* NOTIFICATIONS */}
            <Link
              to="/notifications"
              className="font-semibold text-gray-700 hover:text-green-600 transition"
            >
              🔔
            </Link>

            <Link
              to="/orders"
              className="text-gray-700 font-medium hover:text-green-600 transition"
            >
              Orders
            </Link>

            <Link
              to="/profile"
              className="text-gray-700 font-medium hover:text-green-600 transition"
            >
              Profile
            </Link>

            {/* CART */}
            <Link
              to="/cart"
              className="relative bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              🛒 Cart

              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
}

export default StudentNavbar;