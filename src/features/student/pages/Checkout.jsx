import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

import { clearCart } from "../../../store/cartSlice";
import { createOrder } from "../../../services/orderService";

function Checkout() {
  const cartItems = useSelector((state) => state.cart.items);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [orderType, setOrderType] = useState(
    location.state?.orderType || "pickup"
  );

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  // Delivery fee
  const deliveryFee = orderType === "delivery" ? 20 : 0;

  // Final total
  const totalAmount = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add some items first.");
      return;
    }

    if (orderType === "delivery" && !address) {
      alert("Please select your delivery location.");
      return;
    }

    try {
      setLoading(true);

      // Order data sent to existing Firestore service
      const order = {
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
        })),

        total: totalAmount,

        orderType,

        deliveryLocation:
          orderType === "delivery"
            ? address
            : "Apple A Day Café",

        paymentMethod,

        paymentStatus: "Pending",

        orderStatus: "Pending",

        createdAt: new Date(),

      };

      // Save order in Firestore
      const orderId = await createOrder(order);

      console.log("Order created:", orderId);

      // Clear Redux cart
      dispatch(clearCart());

      alert("Order placed successfully! 🎉");

      // Go to My Orders
      navigate("/orders");
    } catch (error) {
      console.error("Failed to place order:", error);

      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8ef] px-5 py-10">
      <div className="max-w-6xl mx-auto">

        {/* PAGE TITLE */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Checkout
          </h1>

          <p className="text-gray-500 mt-2">
            Choose how you want to receive your order.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">

            {/* ORDER TYPE */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">

              <h2 className="text-xl font-bold text-gray-800 mb-5">
                How would you like to receive your order?
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">

                {/* PICKUP */}
                <button
                  type="button"
                  onClick={() => {
                    setOrderType("pickup");
                    setAddress("");
                  }}
                  className={`text-left p-5 rounded-xl border-2 transition ${
                    orderType === "pickup"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <div className="text-4xl mb-3">
                    🛍️
                  </div>

                  <h3 className="text-lg font-bold text-gray-800">
                    Pickup
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Pick up your order from Apple A Day Café.
                  </p>

                  {orderType === "pickup" && (
                    <p className="text-orange-600 font-semibold mt-3">
                      ✓ Selected
                    </p>
                  )}
                </button>

                {/* DELIVERY */}
                <button
                  type="button"
                  onClick={() => setOrderType("delivery")}
                  className={`text-left p-5 rounded-xl border-2 transition ${
                    orderType === "delivery"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <div className="text-4xl mb-3">
                    🛵
                  </div>

                  <h3 className="text-lg font-bold text-gray-800">
                    Campus Delivery
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Get your food delivered to your campus location.
                  </p>

                  {orderType === "delivery" && (
                    <p className="text-orange-600 font-semibold mt-3">
                      ✓ Selected
                    </p>
                  )}
                </button>

              </div>
            </div>

            {/* DELIVERY LOCATION */}
            {orderType === "delivery" && (
              <div className="bg-white rounded-2xl shadow-sm border p-6">

                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Delivery Location
                </h2>

                <p className="text-gray-500 text-sm mb-5">
                  Select where you want your food delivered.
                </p>

                <select
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">
                    Select campus location
                  </option>

                  <option value="Bibi Rajni Ji Hostel">
                    Bibi Rajni Ji Hostel
                  </option>

                  <option value="Nursing Hostel">
                    Nursing Hostel
                  </option>

                  <option value="New Hostel">
                    New Hostel
                  </option>

                  <option value="EU">
                    EU
                  </option>

                  <option value="Sangat Building">
                    Sangat Building
                  </option>

                  <option value="Teacher Building">
                    Teacher Building
                  </option>

                  <option value="VIP Building">
                    VIP Building
                  </option>

                  <option value="Hospital">
                    Hospital
                  </option>

                  <option value="Barrier">
                    Barrier
                  </option>
                </select>

              </div>
            )}

            {/* PAYMENT METHOD */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">

              <h2 className="text-xl font-bold text-gray-800 mb-5">
                Payment Method
              </h2>

              <div className="space-y-3">

                {/* CASH */}
                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("Cash on Delivery")
                  }
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 ${
                    paymentMethod === "Cash on Delivery"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">

                    <span className="text-2xl">
                      💵
                    </span>

                    <div className="text-left">
                      <p className="font-semibold">
                        Cash on Delivery / Pickup
                      </p>

                      <p className="text-sm text-gray-500">
                        Pay when you receive your order.
                      </p>
                    </div>

                  </div>

                  {paymentMethod === "Cash on Delivery" && (
                    <span className="text-orange-600 font-bold">
                      ✓
                    </span>
                  )}
                </button>

                {/* UPI */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("UPI")}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 ${
                    paymentMethod === "UPI"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">

                    <span className="text-2xl">
                      📱
                    </span>

                    <div className="text-left">
                      <p className="font-semibold">
                        UPI
                      </p>

                      <p className="text-sm text-gray-500">
                        Pay using UPI.
                      </p>
                    </div>

                  </div>

                  {paymentMethod === "UPI" && (
                    <span className="text-orange-600 font-bold">
                      ✓
                    </span>
                  )}
                </button>

              </div>
            </div>

            {/* YOUR ITEMS */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">

              <h2 className="text-xl font-bold text-gray-800 mb-5">
                Your Items
              </h2>

              {cartItems.length === 0 ? (
                <div className="text-center py-8">

                  <div className="text-4xl mb-3">
                    🛒
                  </div>

                  <p className="text-gray-500">
                    Your cart is empty.
                  </p>

                </div>
              ) : (
                <div className="space-y-4">

                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>

                        <h3 className="font-semibold text-gray-800">
                          {item.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          ₹{item.price} × {item.quantity}
                        </p>

                      </div>

                      <p className="font-bold text-gray-800">
                        ₹{item.price * item.quantity}
                      </p>

                    </div>
                  ))}

                </div>
              )}

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div>

            <div className="bg-white rounded-2xl shadow-sm border p-6 lg:sticky lg:top-24">

              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>

              <div className="flex justify-between mb-4">

                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-medium">
                  ₹{subtotal}
                </span>

              </div>

              <div className="flex justify-between mb-4">

                <span className="text-gray-500">
                  Delivery Fee
                </span>

                <span className="font-medium">
                  {deliveryFee === 0
                    ? "Free"
                    : `₹${deliveryFee}`}
                </span>

              </div>

              <div className="border-t pt-4">

                <div className="flex justify-between">

                  <span className="text-lg font-bold">
                    Total
                  </span>

                  <span className="text-xl font-bold text-orange-600">
                    ₹{totalAmount}
                  </span>

                </div>

              </div>

              {/* ORDER INFORMATION */}
              <div className="mt-5 bg-gray-50 rounded-lg p-4">

                <p className="text-sm text-gray-500">
                  Order Type
                </p>

                <p className="font-semibold mt-1">
                  {orderType === "delivery"
                    ? "🛵 Campus Delivery"
                    : "🛍️ Pickup"}
                </p>

                {orderType === "delivery" && address && (
                  <>
                    <p className="text-sm text-gray-500 mt-3">
                      Delivery Location
                    </p>

                    <p className="font-medium mt-1">
                      📍 {address}
                    </p>
                  </>
                )}

              </div>

              {/* PLACE ORDER */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={loading}
                className={`w-full mt-6 text-white py-3.5 rounded-xl font-bold transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {loading
                  ? "Placing Order..."
                  : `Place Order • ₹${totalAmount}`}
              </button>

              <p className="text-xs text-gray-400 text-center mt-4">
                By placing your order, you agree to the café
                ordering terms.
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;