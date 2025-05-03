import React from 'react';
import NotificationPanel from '../../components/User/Notification';
import Sidebar from '../../components/Sidebar';

export default function NotificationsPage() {
  return (
    <div className="flex bg-[#BFD7ED] min-h-screen">
    <Sidebar />

      <NotificationPanel onClose={() => {}} />
    </div>
  );
}
