import React from "react";
import "../support.css";

const NotificationCard = ({
  title,
  message,
  time,
  type = "General",
  read = false,
  onMarkRead,
}) => {
  return (
    <div
      className={`notification-card ${
        read ? "notification-read" : "notification-unread"
      }`}
    >
      <div className="notification-content">

        {/* Icon */}
        <div
          className={`notification-icon ${
            read
              ? "notification-icon-read"
              : "notification-icon-unread"
          }`}
        >
          🔔
        </div>

        {/* Main Content */}
        <div className="notification-main">

          <div className="notification-top">
            <div>
              <h3 className="notification-title">
                {title}
              </h3>

              {!read && (
                <span className="notification-new">
                  New
                </span>
              )}
            </div>
          </div>

          <p className="notification-message">
            {message}
          </p>

          <div className="notification-meta">
            <span>{type}</span>

            <span>•</span>

            <span>{time}</span>
          </div>
        </div>

        {/* Mark Read */}
        {!read && onMarkRead && (
          <button
            type="button"
            onClick={onMarkRead}
            className="notification-read-button"
          >
            Mark read
          </button>
        )}

      </div>
    </div>
  );
};

export default NotificationCard;