import React, { useState } from 'react';
import photo from '../assets/banker.jpg';

export default function ChatList({ selectedChat, setSelectedChat }) {
const [searchTerm, setSearchTerm] = useState('');

const departments = [
    { name: 'ABC Bank Support', msg: 'Your account has been verified.', time: 'Today, 9:52am', unread: 2, avatar: photo },
    { name: 'Loan Department', msg: 'Your loan application is under review.', time: 'Yesterday, 12:31pm', avatar: photo },
    { name: 'Card Services', msg: "We've blocked your lost card as requested.", time: 'Wednesday, 9:12am', avatar: photo },
    { name: 'Online Banking Helpdesk', msg: 'Please reset your password using the link sent.', time: 'Today, 8:40am', unread: 1, avatar: photo }
  ];
  

  const people = [
    { name: 'John Smith', msg: "Your account statement is ready.", time: 'Today, 9:52am', avatar: photo, seen: true },
    { name: 'Sarah Johnson', msg: 'Can you assist with my transaction?', time: 'Today, 12:11pm', unread: 1, avatar: photo },
    { name: 'Mr. Ahmed (Manager)', msg: 'Please bring the signed documents.', time: 'Today, 2:40pm', unread: 1, avatar: photo },
    { name: 'Emily Davis', msg: 'Thanks for helping with my account setup.', time: 'Yesterday, 12:31pm', unread: 2, avatar: photo },
    { name: 'Michael Brown', msg: 'I’ll visit the branch tomorrow.', time: 'Wednesday, 11:12am', seen: true, avatar: photo }
  ];
  
const filteredDepartments = departments.filter(chat =>
chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
chat.msg.toLowerCase().includes(searchTerm.toLowerCase())
);

const filteredPeople = people.filter(user =>
user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
user.msg.toLowerCase().includes(searchTerm.toLowerCase())
);

return (
<aside className="w-90 mr-7 my-5 border-r p-4 flex flex-col gap-4 scrollbar-blue overflow-y-auto">
{/* Search Box */}
<input
type="text"
placeholder="Search..."
value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
className="mb-2 px-4 py-2 rounded-full shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
style={{ boxShadow: '0 0 4px #0074B7' }}
/>

{/* Departments Card */}
<div className="bg-white rounded-xl p-4 shadow-md" style={{ boxShadow: '0 0 8px #0074B7' }}>
<h2 className="text-xl font-bold text-gray-800 mb-3">Departement</h2>
{filteredDepartments.map((chat, index) => (
<div key={index}
onClick={() => setSelectedChat(chat)}
className="flex items-center justify-between px-3 my-2 rounded-4xl hover:bg-[#0074B7] transition duration-200 last:border-0">
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

{/* People Card */}
<div className="bg-white rounded-xl p-4 shadow-md" style={{ boxShadow: '0 0 8px #0074B7' }}>
<h2 className="text-xl font-bold text-gray-800 mb-3">People</h2>
{filteredPeople.map((user, index) => (
<div key={index}
onClick={() => setSelectedChat(user)}
className="flex items-center justify-between px-3 my-2 rounded-4xl last:border-0 hover:bg-[#0074B7] transition duration-200">
<div className="flex items-center gap-2">
<img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
<div>
<div className="font-semibold text-sm">{user.name}</div>
<div className="text-xs text-gray-500 truncate w-44">{user.msg}</div>
</div>
</div>
<div className="text-right text-xs text-gray-400">
<div>{user.time}</div>
{user.unread && <div className="bg-red-500 text-white text-xs px-2 py-0.5 w-8 rounded-full ml-8 mt-1">{user.unread}</div>}
{user.seen && <div className="text-green-500 text-xs">✔✔</div>}
</div>
</div>
))}
</div>
</aside>
);
}

