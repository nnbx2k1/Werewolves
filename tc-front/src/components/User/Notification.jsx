import React from "react";
import NotificationCard from "./NotificationCard";

export default function NotificationPanel({ onClose }) {
  const notifications = [
    {
      id: 1,
      icon: "📩",
      title: "New Message from Admin",
      description: "Please check your inbox for the latest update.",
      time: "2 minutes ago",
    },
    {
      id: 2,
      icon: "🔔",
      title: "Event Reminder",
      description: "Meeting scheduled today at 3 PM.",
      time: "1 hour ago",
    },
    {
      id: 3,
      icon: "✅",
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
      time: "Yesterday",
    },
  ];

  return (
    <div className="flex-1 bg-white rounded-3xl shadow-lg p-6 m-7">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition"
        >
          ✕
        </button>
      </div>

      <ul className="space-y-4">
        {notifications.map((notif) => (
          <li key={notif.id}>
            <NotificationCard
              icon={notif.icon}
              title={notif.title}
              description={notif.description}
              time={notif.time}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
