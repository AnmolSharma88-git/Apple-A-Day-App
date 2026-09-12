import React, { useState } from "react";

import TrackingTimeline from "../components/TrackingTimeline";
import DeliveryStatus from "../components/DeliveryStatus";
import "../support.css";

const OrderTracking = () => {
  const DELIVERY_STAGES = [
    "Pending",
    "Accepted",
    "Preparing",
    "Ready",
    "Out for Delivery",
    "Delivered",
  ];

  const PICKUP_STAGES = [
    "Pending",
    "Accepted",
    "Preparing",
    "Ready",
    "Picked Up",
  ];

  const [orderType, setOrderType] =
    useState("delivery");

  const [currentStatus, setCurrentStatus] =
    useState("Pending");

  const stages =
    orderType === "delivery"
      ? DELIVERY_STAGES
      : PICKUP_STAGES;

  const handleOrderTypeChange = (type) => {
    setOrderType(type);
    setCurrentStatus("Pending");
  };

  return (
    <div className="support-page">
      <div className="support-container">

        <div className="support-card">

          <h1 className="support-title">
            Order Tracking
          </h1>

          <p className="support-subtitle">
            Track your order from confirmation
            to completion.
          </p>

          {/* ORDER INFORMATION */}

          <div className="order-info-grid">

            <div className="order-info-box">
              <p className="order-info-label">
                Order ID
              </p>

              <p className="order-info-value">
                #AAD-1024
              </p>
            </div>

            <div className="order-info-box">
              <p className="order-info-label">
                Order Type
              </p>

              <p className="order-info-value">
                {orderType === "delivery"
                  ? "Delivery"
                  : "Pickup"}
              </p>
            </div>

          </div>

          {/* ORDER TYPE */}

          <div className="status-section">

            <p className="status-label">
              Order Type
            </p>

            <div className="status-buttons">

              <button
                className={`status-button ${
                  orderType === "delivery"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleOrderTypeChange("delivery")
                }
              >
                Delivery
              </button>

              <button
                className={`status-button ${
                  orderType === "pickup"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleOrderTypeChange("pickup")
                }
              >
                Pickup
              </button>

            </div>

          </div>

          {/* STATUS */}

          <div className="status-section">

            <p className="status-label">
              Test Current Status
            </p>

            <div className="status-buttons">

              {stages.map((stage) => (
                <button
                  key={stage}
                  className={`status-button ${
                    currentStatus === stage
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setCurrentStatus(stage)
                  }
                >
                  {stage}
                </button>
              ))}

            </div>

          </div>

          {/* CURRENT STATUS */}

          <div className="status-section">

            <p className="status-label">
              Current Status
            </p>

            <DeliveryStatus
              status={currentStatus}
            />

          </div>

        </div>

        {/* TIMELINE */}

        <TrackingTimeline
          orderType={orderType}
          currentStatus={currentStatus}
        />

      </div>
    </div>
  );
};

export default OrderTracking;