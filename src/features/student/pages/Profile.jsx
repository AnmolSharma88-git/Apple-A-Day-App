import { useEffect, useState } from "react";

import { useAuth } from "../../../hooks/useAuth";
import { getUserOrders } from "../../../services/orderService";

function Profile() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.uid) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        const userOrders = await getUserOrders(user.uid);
        setOrders(userOrders || []);
      } catch (error) {
        console.error("Failed to load orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user?.uid]);

  // MONTHLY SPENDING
  const monthlySpending = {};

  orders.forEach((order) => {
    if (!order.createdAt) return;

    const date =
      order.createdAt?.toDate
        ? order.createdAt.toDate()
        : new Date(order.createdAt);

    if (Number.isNaN(date.getTime())) return;

    const month = date.toLocaleString("en-IN", {
      month: "long",
      year: "numeric",
    });

    if (!monthlySpending[month]) {
      monthlySpending[month] = 0;
    }

    monthlySpending[month] += Number(
      order.totalAmount ?? order.total ?? 0
    );
  });

  const totalSpent = orders.reduce(
    (total, order) =>
      total + Number(order.totalAmount ?? order.total ?? 0),
    0
  );

  const averageOrder = orders.length
    ? Math.round(totalSpent / orders.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#fff8ef] px-5 py-10">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold">
          My Profile
        </h1>

        {/* PROFILE CARD */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mt-8">

          <div className="flex items-center gap-5">

            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-4xl">
              👤
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {user?.name || user?.displayName || "Student"}
              </h2>

              <p className="text-gray-500">
                {user?.email || "No email available"}
              </p>

              {user?.phone && (
                <p className="text-gray-500">
                  {user.phone}
                </p>
              )}

            </div>

          </div>

        </div>

        {/* SPENDING SUMMARY */}
        <div className="grid md:grid-cols-3 gap-5 mt-6">

          <div className="bg-white p-6 rounded-xl border">
            <p className="text-gray-500">
              Total Orders
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {loading ? "..." : orders.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl border">
            <p className="text-gray-500">
              Total Spending
            </p>

            <h2 className="text-3xl font-bold text-orange-600 mt-2">
              {loading ? "..." : `₹${totalSpent}`}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl border">
            <p className="text-gray-500">
              Average Order
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {loading ? "..." : `₹${averageOrder}`}
            </h2>
          </div>

        </div>

        {/* MONTHLY SPENDING */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mt-6">

          <h2 className="text-xl font-bold">
            📊 Monthly Spending
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Your café spending month by month.
          </p>

          <div className="space-y-4 mt-6">

            {loading ? (

              <p className="text-gray-500">
                Loading spending data...
              </p>

            ) : Object.keys(monthlySpending).length === 0 ? (

              <p className="text-gray-500">
                No spending data available yet.
              </p>

            ) : (

              Object.entries(monthlySpending).map(
                ([month, amount]) => (

                  <div
                    key={month}
                    className="flex justify-between items-center bg-gray-50 rounded-lg p-4"
                  >

                    <span className="font-medium">
                      {month}
                    </span>

                    <span className="font-bold text-orange-600">
                      ₹{amount}
                    </span>

                  </div>

                )
              )

            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default Profile;