import React, { useState } from 'react';
import ChatList from '../../components/ChatList';
import ChatBox from '../../components/ChatBox';

function Chatadmin() {
const [selectedChat, setSelectedChat] = useState(null);

const [chatMessages, setChatMessages] = useState({
    "Bank Support": [
      { from: "left", text: "Hello! Welcome to ABC Bank. How can I help you today?", time: "Today, 9:00am" },
      { from: "right", text: "Hi, I have a question about a recent transaction.", time: "Today, 9:01am" },
      { from: "left", text: "Sure, could you please provide the transaction ID or date?", time: "Today, 9:02am" },
      { from: "right", text: "Yes, it's TXN123456 on May 2nd.", time: "Today, 9:03am" },
      { from: "left", text: "Thank you. One moment while I check that for you...", time: "Today, 9:04am" },
      { from: "left", text: "The transaction of $250 was successfully processed to Amazon. Do you need help with a refund or something else?", time: "Today, 9:06am" },
      { from: "right", text: "Yes, I didn’t authorize that. Can I dispute it?", time: "Today, 9:07am" },
      { from: "left", text: "Understood. I’ve initiated the dispute process. You’ll receive an update within 24 hours.", time: "Today, 9:08am" },
      { from: "right", text: "Thank you for the help!", time: "Today, 9:09am" },
      { from: "left", text: "You're welcome. Have a great day!", time: "Today, 9:10am" },
    ],
  });
  
const handleSendMessage = (newMessage) => {
if (!selectedChat?.name) return;
const chatName = selectedChat.name;

setChatMessages((prev) => ({
...prev,
[chatName]: [...(prev[chatName] || []), newMessage],
}));
};

return (
<div className="flex h-[90vh] w-full max-w-[1200px] mx-auto bg-white rounded-3xl shadow-lg mt-6 overflow-hidden">
{/* Sidebar + Chat List (30%) */}
<div className="w-[35%] bg-[#E9F1FA] border-r border-gray-300 overflow-y-auto p-4">
<h2 className="text-xl font-bold mb-4 text-gray-700">Chats</h2>
<ChatList selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
</div>

{/* Chat Box (70%) */}
<div className="w-[70%] bg-[#F6FBFF] p-6 flex flex-col overflow-hidden">
<ChatBox
selectedChat={selectedChat}
messages={chatMessages[selectedChat?.name] || []}
onSend={handleSendMessage}
/>
</div>
</div>

);
}

export default Chatadmin;
