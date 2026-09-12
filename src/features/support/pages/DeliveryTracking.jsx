import React, { useState } from "react";

import TrackingTimeline from "../components/TrackingTimeline";
import DeliveryStatus from "../components/DeliveryStatus";
import "../support.css";

const DeliveryTracking = () => {
  const DELIVERY_STAGES = [
    "Pending",
    "Accepted",
    "Preparing",
    "Ready",
    "Out for Delivery",
    "Delivered",
  ];

  const [currentStatus, setCurrentStatus] =
    useState("Pending");

  return (
    <div className="support-page">
      <div className="support-container">

        {/* Main Information Card */}
        <div className="support-card">

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="support-title">
                Delivery Tracking
              </h1>

              <p className="support-subtitle">
                Track your delivery order from preparation
                to final delivery.
              </p>
            </div>

            <DeliveryStatus status={currentStatus} />
          </div>

          {/* Order Information */}
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
                Delivery
              </p>
            </div>

            <div className="order-info-box">
              <p className="order-info-label">
                Delivery Location
              </p>

              <p className="order-info-value">
                Main Hostel
              </p>
            </div>

            <div className="order-info-box">
              <p className="order-info-label">
                Payment
              </p>

              <p className="order-info-value">
                Cash on Delivery
              </p>
            </div>

          </div>

          {/* Status Selector */}
          <div className="status-section">

            <p className="status-label">
              Delivery Status
            </p>

            <div className="status-buttons">

              {DELIVERY_STAGES.map((stage) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setCurrentStatus(stage)}
                  className={`status-button ${
                    currentStatus === stage
                      ? "active"
                      : ""
                  }`}
                >
                  {stage}
                </button>
              ))}

            </div>

          </div>

          {/* Current Status */}
          <div className="status-section">

            <p className="status-label">
              Current Status
            </p>

            <DeliveryStatus
              status={currentStatus}
            />

          </div>

        </div>

        {/* Timeline Card */}
        <TrackingTimeline
          orderType="delivery"
          currentStatus={currentStatus}
        />

      </div>
    </div>
  );
};

export default DeliveryTracking;