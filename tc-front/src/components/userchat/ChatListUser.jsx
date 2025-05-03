// ChatList.jsx – Refined Based on UI Screenshot
import React from 'react';
import photo from "../../assets/photo.svg";


export default function ChatList() {
  return (
    <aside className="w-90 mr-7 my-5 border-r p-4 flex flex-col scrollbar-blue gap-4 overflow-y-auto">
      {/* Search Box */}
      <input
        type="text"
        placeholder="Search..."
        className="mb-2 px-4 py-2 rounded-full shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
        style={{ boxShadow: '0 0 4px #0074B7' }}
      />

      {/* Departments Card */}

      <div className="bg-white rounded-xl p-4 shadow-md" style={{ boxShadow: '0 0 8px #0074B7' }}>
        <h2 className="text-xl font-bold text-gray-800  mb-14">Bank</h2>
        {[
          { name: 'Friends Forever', msg: 'Hahahaha!', time: 'Today, 9:52pm', unread: 4, avatar: photo },
         
        ].map((chat, index) => (
          <div key={index} className="flex items-center justify-between mb-120 border-b  px-3 py-3 rounded-4xl hover:bg-[#0074B7] transition duration-200 last:border-0">
            <div className="flex items-center gap-2">
              <img src={chat.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
              <div>
                <div className="font-semibold text-sm">{chat.name}</div>
                <div className="text-xs text-gray-500 truncate w-44">{chat.msg}</div>
              </div>
            </div>
            <div className="text-right text-xs text-gray-400">
              <div>{chat.time}</div>
              {chat.unread && <div className="bg-red-500 text-white text-xs px-2 py-0.5 w-8 rounded-full ml-8 mt-1">{chat.unread}</div>}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}