import { useState } from "react";
import Sidebar from '../../components/Sidebar.jsx';
import NotificationsPanel from "../../components/User/Notification.jsx";
import ProfileDetails from "../../components/User/UserProfile.jsx";

export default function Homepage() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Sidebar */}
      <Sidebar 
        onNotificationClick={() => setShowNotifications(true)}
        onProfileClick={() => setShowProfilePopup(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-8 ml-20 transition-all duration-300">
        {showNotifications ? (
          <NotificationsPanel onClose={() => setShowNotifications(false)} />
        ) : (
          <section className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-3">👋</span>
                Welcome to Your Dashboard!
              </h1>
              <p className="text-gray-600 text-lg">
                Get started by exploring your health metrics or checking your latest reports.
              </p>
              <div className="mt-6 bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Quick Actions
                </h3>
                <div className="flex gap-4">
                  <button className="text-blue-600 hover:text-blue-800 transition-colors">
                    View Appointments
                  </button>
                  <button className="text-blue-600 hover:text-blue-800 transition-colors">
                    Upload Documents
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Profile Popup */}
      {showProfilePopup && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300"
          onClick={() => setShowProfilePopup(false)} // Click outside to close
        >
          <div
            className="relative w-[90%] md:w-[70%] lg:w-[55%] max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-br from-white to-[#72A1CD] shadow-2xl p-6 animate-fade-in"
            onClick={(e) => e.stopPropagation()} // Prevent close on card click
          >
            {/* Close Button */}
            <button
              onClick={() => setShowProfilePopup(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>

            {/* Profile Details Component */}
            <ProfileDetails />
          </div>
        </div>
      )}
    </div>
  );
}
