import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // 👈 Add this
import { AuthProvider } from './context/AuthContext';

// Pages & Components
import Homepage from './pages/Landingpage/HeroPage.jsx';
import Login from './pages/login/login.jsx';
import SignUpUser from './pages/SignUp/SignUpUser.jsx';
import ResetPassword from './components/login/ResetPassword.jsx';
import UserProfile from './pages/user/UserProfile.jsx';
import NotificationsPage from './pages/user/NotificationsPage.jsx';
import HomePage from './pages/user/HomePage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import Chatadmin from './pages/admin/Chatadmin';
import Chatuser from './pages/user/chatuser';
import ESignature from './components/signateur';
import UserHome from './components/PageHome';

// ✅ Create QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}> {/* ✅ Wrap app */}
      <AuthProvider>
        <div className="flex h-screen">
          <div className="flex-1 overflow-auto">
            <Routes>
              {/* Auth & Main Pages */}
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/SignUpUser" element={<SignUpUser />} />

              {/* User/Admin Dashboards */}
              <Route path="/AdminDashboard" element={<AdminDashboard />} />

              {/* Messaging + Signature */}
              <Route path="/chatadmin" element={<Chatadmin />} />
              <Route path="/chatuser" element={<Chatuser />} />
              <Route path="/esign" element={<ESignature />} />
              <Route path="/userhome" element={<UserHome />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile" element={<UserProfile />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
