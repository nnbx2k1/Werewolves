import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import ChatListUser from '../../components/userchat/ChatListUser';
import ChatBoxUser from '../../components/userchat/ChatBoxUser';


function Chatuser() {
    const [selectedChat, setSelectedChat] = useState('Anil');
    
    return (
      <div className="flex h-screen w-full bg-[#BFD7ED]">
        <Sidebar />
        <ChatListUser selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
        <ChatBoxUser selectedChat={selectedChat} />
      </div>
    );
  }

export default Chatuser;