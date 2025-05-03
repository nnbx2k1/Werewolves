import React, { useState } from "react";
import sidebarAdmin from "./SidebarAdmin";
const notificationsData = [
  { id: 1, type: "document uploaded", message: "User A uploaded a document.", time: "2 mins ago", details: "File: Resume.pdf, Size: 2MB" },
  { id: 2, type: "login", message: "User B logged in.", time: "10 mins ago", details: "Location: New York, IP: 192.168.1.1" },
  { id: 3, type: "document viewed", message: "User C viewed a document.", time: "15 mins ago", details: "Viewed: Contract.docx" },
  { id: 4, type: "logout", message: "User A logged out.", time: "20 mins ago", details: "Session duration: 45 mins" },
  { id: 5, type: "signature added", message: "User D added a signature.", time: "25 mins ago", details: "Signed: Agreement.pdf" },
  { id: 6, type: "document downloaded", message: "User E downloaded a document.", time: "30 mins ago", details: "File: Invoice_2024.pdf" },
  { id: 7, type: "document deleted", message: "User F deleted a document.", time: "35 mins ago", details: "File: Draft_Proposal.docx" },
];

const filters = [
  "all",
  "document uploaded",
  "document viewed",
  "document downloaded",
  "document deleted",
  "signature added",
  "login",
  "logout",
];

function NotificationItem({ notification, onClick }) {
  return (
    
    <div
      onClick={() => onClick(notification)}
      className="bg-white p-4 rounded-lg shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="font-medium text-gray-800">{notification.message}</div>
      <div className="text-sm text-gray-500 mt-1">{notification.time}</div>
      <div className="text-xs text-blue-500 mt-1 uppercase">{notification.type}</div>
    </div>
  );
}

export default function NotificationDashboard() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [popup, setPopup] = useState(null);

  const filteredNotifications =
    selectedFilter === "all"
      ? notificationsData
      : notificationsData.filter((n) => n.type === selectedFilter);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Notification Dashboard</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm border font-medium ${
              selectedFilter === filter
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onClick={setPopup} />
          ))
        ) : (
          <div className="text-gray-500">No notifications found for this filter.</div>
        )}
      </div>

      {/* Popup */}
      {popup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">Notification Details</h2>
            <p className="text-gray-800 mb-2">{popup.message}</p>
            <p className="text-gray-600 text-sm mb-2">{popup.time}</p>
            <p className="text-blue-500 text-xs uppercase mb-4">{popup.type}</p>
            <p className="text-gray-700">{popup.details}</p>
            <button
              onClick={() => setPopup(null)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
