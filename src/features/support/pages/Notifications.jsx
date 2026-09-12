import React, { useState } from "react";

import NotificationCard from "../components/NotificationCard";
import "../support.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Order Accepted",
      message:
        "Your order #AAD-1024 has been accepted by the café.",
      type: "Order",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Order Preparing",
      message:
        "Your order #AAD-1024 is now being prepared.",
      type: "Order",
      time: "5 minutes ago",
      read: false,
    },
    {
      id: 3,
      title: "Order Ready",
      message:
        "Your order #AAD-1018 is ready for pickup.",
      type: "Pickup",
      time: "1 hour ago",
      read: true,
    },
    {
      id: 4,
      title: "Order Delivered",
      message:
        "Your order #AAD-1009 has been delivered successfully.",
      type: "Delivery",
      time: "Yesterday",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  return (
    <div className="support-page">
      <div className="support-container">

        {/* Header Card */}
        <div className="support-card">

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="support-title">
                Notifications
              </h1>

              <p className="support-subtitle">
                Stay updated about your orders and café
                activity.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="status-button active"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification Summary */}
          <div className="order-info-grid">

            <div className="order-info-box">
              <p className="order-info-label">
                Total Notifications
              </p>

              <p className="order-info-value">
                {notifications.length}
              </p>
            </div>

            <div className="order-info-box">
              <p className="order-info-label">
                Unread Notifications
              </p>

              <p className="order-info-value">
                {unreadCount}
              </p>
            </div>

          </div>

        </div>

        {/* Notification List */}
        <div className="timeline-card">

          <div className="timeline-header">
            <h2 className="timeline-title">
              Recent Notifications
            </h2>

            <p className="timeline-type">
              Your latest order and delivery updates
            </p>
          </div>

          <div className="space-y-4">

            {notifications.length === 0 ? (
              <div className="support-card">
                <p className="support-subtitle">
                  You don't have any notifications yet.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  title={notification.title}
                  message={notification.message}
                  type={notification.type}
                  time={notification.time}
                  read={notification.read}
                  onMarkRead={
                    notification.read
                      ? undefined
                      : () => markAsRead(notification.id)
                  }
                />
              ))
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default Notifications;