import React, { useState } from "react";

import OrderTracking from "./OrderTracking";
import DeliveryTracking from "./DeliveryTracking";
import Notifications from "./Notifications";
import Reviews from "./Reviews";

const SupportTest = () => {
  const [activePage, setActivePage] = useState("order");

  const renderPage = () => {
    switch (activePage) {
      case "order":
        return <OrderTracking />;

      case "delivery":
        return <DeliveryTracking />;

      case "notifications":
        return <Notifications />;

      case "reviews":
        return <Reviews />;

      default:
        return <OrderTracking />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Testing Navigation */}
      <div className="sticky top-0 z-50 border-b bg-white p-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl flex-wrap gap-2">
          <button
            onClick={() => setActivePage("order")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activePage === "order"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Order Tracking
          </button>

          <button
            onClick={() => setActivePage("delivery")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activePage === "delivery"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Delivery Tracking
          </button>

          <button
            onClick={() => setActivePage("notifications")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activePage === "notifications"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Notifications
          </button>

          <button
            onClick={() => setActivePage("reviews")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activePage === "reviews"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Reviews
          </button>
        </div>
      </div>

      {/* Selected Page */}
      <div>{renderPage()}</div>
    </div>
  );
};

export default SupportTest;