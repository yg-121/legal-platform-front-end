/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import axios from "axios";

interface NotificationsProps {
  notifications: any[];
  setNotifications: (notifications: any[]) => void;
  stats: { totalUsers: number; lawyers: number; pendingLawyers: number; totalCases: number };
  getAxiosConfig: () => any;
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, setNotifications, stats, getAxiosConfig }) => {
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const config = getAxiosConfig();
      if (!config.headers) return;

      console.log(`Attempting to mark notification ${notificationId} as read`);
      const response = await axios.patch(
        `http://localhost:5000/api/notifications/notifications/${notificationId}/read`, // Updated URL
        {},
        config
      );
      console.log("Mark as read response:", response.data);
      setNotifications(notifications.map((n) =>
        n._id === notificationId ? { ...n, status: "Read" } : n
      ));
    } catch (err: any) {
      console.error("Mark as read error:", err.response?.data || err.message);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Notifications</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</h3>
            <p className="text-2xl font-bold mt-1">{stats.totalUsers}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Lawyers</h3>
            <p className="text-2xl font-bold mt-1">{stats.lawyers}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Lawyers</h3>
            <p className="text-2xl font-bold mt-1 text-yellow-500">{stats.pendingLawyers}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Cases</h3>
            <p className="text-2xl font-bold mt-1">{stats.totalCases}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium">Recent Notifications</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 ${notification.status === "Unread" ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
            >
              <div className="flex justify-between">
                <p className="text-sm">{notification.message}</p>
                {notification.status === "Unread" && (
                  <button
                    onClick={() => {
                      console.log("Notification ID to mark:", notification._id); // Debug
                      handleMarkAsRead(notification._id);
                    }}
                    className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 text-xs"
                  >
                    Mark as read
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;