import photo from "../assets/photo.svg";
import React from "react";
import { NavLink } from "react-router-dom";
import { HomeIcon, MessageIcon, BellIcon, SettingsIcon, LogoutIcon } from "./Icons";

function Sidebar() {
  const baseClass = "p-3 rounded-full text-white hover:bg-blue-400 transition duration-200";
  const activeClass = "bg-[#BFD7ED] text-[#0074B7]";

  return (
    <aside className="w-20 bg-[#0074B7] flex flex-col items-center py-6 my-6 ml-6 mr-4 rounded-3xl shadow-lg">
      {/* Profile Link */}
      <NavLink
        to="/profile"
        className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ""} mb-12`}
      >
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img src={photo} alt="Profile" className="w-full h-full object-cover" />
        </div>
      </NavLink>

      <nav className="flex flex-col items-center gap-6 flex-1">
        <NavLink
          to="/userhome"
          className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ""}`}
        >
          <HomeIcon />
        </NavLink>

        <NavLink
          to="/chatuser"
          className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ""}`}
        >
          <MessageIcon />
        </NavLink>

        <NavLink
          to="/notifications"
          className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ""}`}
        >
          <BellIcon />
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ""}`}
        >
          <SettingsIcon />
        </NavLink>
      </nav>

      <div className="mb-4">
        <NavLink
          to="/logout"
          className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ""}`}
        >
          <LogoutIcon />
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;
