import React from "react";

export default function NotificationCard({ icon, title, description, time }) {
  return (
    <div className="p-4 bg-blue-50 rounded-xl shadow hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-3">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{title}</h4>
          <p className="text-gray-600 text-sm">{description}</p>
          <span className="text-xs text-gray-400">{time}</span>
        </div>
      </div>
    </div>
  );
}
