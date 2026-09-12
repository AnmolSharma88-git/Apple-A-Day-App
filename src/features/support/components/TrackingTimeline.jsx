import React from "react";
import "../support.css";

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

const normalizeStatus = (status = "") => {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .trim();
};

const TrackingTimeline = ({
  orderType = "delivery",
  currentStatus = "Pending",
}) => {
  const normalizedType = normalizeStatus(orderType);

  const stages =
    normalizedType === "pickup"
      ? PICKUP_STAGES
      : DELIVERY_STAGES;

  const normalizedCurrentStatus =
    normalizeStatus(currentStatus);

  const currentIndex = stages.findIndex(
    (stage) =>
      normalizeStatus(stage) === normalizedCurrentStatus
  );

  return (
    <div className="support-card timeline-card">
      <div className="timeline-header">
        <h2 className="timeline-title">
          Order Tracking
        </h2>

        <p className="timeline-type">
          {normalizedType === "pickup"
            ? "Pickup order"
            : "Delivery order"}
        </p>
      </div>

      <div className="timeline">
        {stages.map((stage, index) => {
          const isCompleted =
            currentIndex !== -1 &&
            index < currentIndex;

          const isCurrent =
            currentIndex === index;

          const isLast =
            index === stages.length - 1;

          return (
            <div
              className="timeline-item"
              key={stage}
            >
              <div className="timeline-marker-area">
                <div
                  className={`timeline-marker ${
                    isCompleted
                      ? "completed"
                      : isCurrent
                      ? "current"
                      : ""
                  }`}
                >
                  {isCompleted || isCurrent
                    ? "✓"
                    : index + 1}
                </div>

                {!isLast && (
                  <div
                    className={`timeline-line ${
                      index < currentIndex
                        ? "completed"
                        : ""
                    }`}
                  />
                )}
              </div>

              <div className="timeline-content">
                <p
                  className={`timeline-stage ${
                    isCompleted
                      ? "completed"
                      : isCurrent
                      ? "current"
                      : ""
                  }`}
                >
                  {stage}
                </p>

                {isCurrent && (
                  <p className="timeline-description current">
                    Current order status
                  </p>
                )}

                {isCompleted && (
                  <p className="timeline-description">
                    Completed
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackingTimeline;