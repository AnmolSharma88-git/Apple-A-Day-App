import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import CartItem from "../components/CartItem";

function Cart() {
  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">

        <div className="text-6xl mb-4">
          🛒
        </div>

        <h2 className="text-2xl font-bold mb-2">
          Your cart is empty
        </h2>

        <p className="text-gray-500 mb-6">
          Add some delicious food to your cart.
        </p>

        <Link
          to="/menu"
          className="bg-orange-500 text-white px-6 py-3 rounded-lg"
        >
          Browse Menu
        </Link>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Your Cart
        </h1>

        <div className="space-y-4">

          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
            />
          ))}

        </div>

        <div className="bg-white mt-8 p-6 rounded-xl shadow">

          <div className="flex justify-between text-xl font-bold mb-5">
            <span>Total</span>

            <span className="text-orange-500">
              ₹{total}
            </span>
          </div>

          <Link
            to="/checkout"
            className="block text-center bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600"
          >
            Proceed to Checkout
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Cart;