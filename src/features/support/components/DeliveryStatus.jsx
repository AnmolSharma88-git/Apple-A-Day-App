import React from "react";
import "../support.css";

const DeliveryStatus = ({
  status = "Pending",
}) => {
  const statusMap = {
    Pending: "status-pending",
    Accepted: "status-accepted",
    Preparing: "status-preparing",
    Ready: "status-ready",
    "Out for Delivery": "status-out",
    Delivered: "status-delivered",
    "Picked Up": "status-picked",
  };

  const statusClass =
    statusMap[status] || "status-pending";

  return (
    <div className="delivery-status-wrapper">
      <span
        className={`delivery-status ${statusClass}`}
      >
        <span className="delivery-status-dot" />
        {status}
      </span>
    </div>
  );
};

export default DeliveryStatus;