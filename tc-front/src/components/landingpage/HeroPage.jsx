// src/components/SecureBankLanding.jsx
import { useState, useEffect } from 'react';
import logo from "../../assets/trustychat.svg";
import image from "../../assets/Group 2.svg";
import { useNavigate } from 'react-router-dom';

export default function SecureBankLanding() {
  const navigate = useNavigate(); // Moved up

  const handleGetStarted = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/SignUpUser");
  };

  const statsTargets = [99, 100, 100];
  const [counts, setCounts] = useState([0, 0, 0]);

  useEffect(() => {
    const intervals = statsTargets.map((target, index) =>
      setInterval(() => {
        setCounts((prev) => {
          const updated = [...prev];
          if (updated[index] < target) updated[index] += 1;
          return updated;
        });
      }, 30)
    );
    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans transition-colors duration-500">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 pb-5">
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            className="h-36 w-40 hover:scale-105 transition-transform duration-500"
            alt="TrustyChat Logo"
          />
        </div>
        <div className="hidden md:flex items-center">
          <button 
            onClick={handleGetStarted}
            className="bg-[#0074B7] mx-3 text-white px-6 py-2 font-semibold rounded hover:bg-[#005a94] transition duration-500 hover:scale-105"
          >
            Login
          </button>
          <button 
            onClick={handleSignUp}
            className="bg-[#0074B7] text-white px-6 py-2 font-semibold rounded hover:bg-[#005a94] transition duration-500 hover:scale-105"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center px-8 md:px-16 py-12">
        <div className="w-full md:w-1/2 mb-10 md:mb-0">
          <h2 className="text-lg text-[#0074B7] font-medium mb-2 transition duration-500 hover:text-[#005a94]">
            Trusted Messaging Infrastructure
          </h2>
          <h1 className="text-5xl font-bold leading-tight mb-6 transition duration-500 text-[#003B73]">
            Secure Communication <br /> Between Banks & Customers
          </h1>
          <button 
            onClick={handleSignUp}
            className="bg-[#0074B7] text-white mb-10 ml-7 px-16 py-3 font-semibold rounded hover:bg-[#005a94] transition duration-500 hover:scale-105"
          >
            Join Us
          </button>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={image}
            alt="Secure Messaging"
            className="w-4/5 max-w-lg mb-10 hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#72a1cd] mt-3 py-10 transition duration-500">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {["Encrypted Message Delivery", "Traceability", "Uptime & Reliability"].map((label, idx) => (
            <div
              key={idx}
              className="hover:scale-105 transition-transform duration-500"
            >
              <div className="text-5xl font-bold text-white">
                {counts[idx]}%
              </div>
              <p className="text-white/70 mt-2 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
