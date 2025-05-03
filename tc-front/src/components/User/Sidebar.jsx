import photo from "../../assets/3.jpg";
import React from "react";
import {
  HomeIcon,
  MessageIcon,
  BellIcon,
  SettingsIcon,
  LogoutIcon,
} from "./Icons.jsx";

function Sidebar({ onNotificationClick, onProfileClick }) {
  return (
    <div className="w-25 h-[95vh] bg-[#0074B7] flex flex-col items-center py-7 ml-7 mr-5 rounded-3xl my-7 shadow-lg">
      <div
        className="w-15 h-15 rounded-full overflow-hidden mb-14 cursor-pointer"
        onClick={onProfileClick}
      >
        <img src={photo} alt="Profile" className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col items-center gap-10 text-white">
        <button className="p-2 rounded-full hover:bg-blue-400 transition duration-200">
          <HomeIcon />
        </button>
        <button className="p-2 rounded-full hover:bg-blue-400 transition duration-200">
          <MessageIcon />
        </button>
        <button
          className="p-2 rounded-full hover:bg-blue-400 transition duration-200"
          onClick={onNotificationClick}
        >
          <BellIcon />
        </button>
        <button className="p-2 rounded-full hover:bg-blue-400 transition duration-200">
          <SettingsIcon />
        </button>
      </div>

      <div className="mt-auto mb-4">
        <button className="p-2 rounded-full hover:bg-blue-400 transition duration-200">
          <LogoutIcon />
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
