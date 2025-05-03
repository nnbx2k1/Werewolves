import React, { useState } from 'react';
import ChatList from '../../components/ChatList';
import ChatBox from '../../components/ChatBox';

function Chatadmin() {
const [selectedChat, setSelectedChat] = useState(null);

const [chatMessages, setChatMessages] = useState({
Anil: [
{ from: "left", text: "Hey There!", time: "Today, 8.30pm" },
{ from: "right", text: "Hello!", time: "Today, 8.33pm" },
],
"Friends Forever": [
{ from: "left", text: "Meeting soon?", time: "Today, 10.00am" },
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
