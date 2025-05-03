import React, { useState, useRef, useEffect } from "react";
import photo from "../../assets/banker.jpg";
import vector from "../../assets/vector.svg";
import fluentVideo from "../../assets/fluent_video-16-regular.svg";
import menu from "../../assets/bi_three-dots-vertical.svg";
import paperClipOutlined from "../../assets/ant-design_paper-clip-outlined.svg";
import fluentEmojiLaugh from "../../assets/fluent_emoji-laugh-16-regular.svg";
import fluentCamera from "../../assets/fluent_camera-24-regular.svg";

const ChatBoxUser = () => {
  const [messages, setMessages] = useState([
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
  ]);
  
  

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newMessage = { from: "right", text: inputValue, time: `Today, ${time}` };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const isImage = file.type.startsWith("image/");

    if (isImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setMessages((prev) => [
          ...prev,
          { from: "right", image: reader.result, time: `Today, ${time}` },
        ]);
      };
      reader.readAsDataURL(file);
    } else {
      setMessages((prev) => [
        ...prev,
        { from: "right", text: `📎 ${file.name}`, time: `Today, ${time}` },
      ]);
    }
  };

  return (
    <div className="w-240 my-7 bg-white rounded-xl shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <img src={photo} alt="Avatar" className="w-10 h-10 rounded-full" />
          <div>
            <div className="font-semibold text-2xl text-gray-800">ABC Bank Support</div>
            <div className="text-sm text-gray-500">Online - Last seen, 2.02pm</div>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <img src={vector} alt="Phone" className="w-6 h-6 cursor-pointer" />
          <img src={fluentVideo} alt="Video" className="w-6 h-6 cursor-pointer" />
          <img src={menu} alt="Menu" className="w-6 h-6 cursor-pointer" />
        </div>
      </div>

      {/* Messages */}
      <div className="p-4 space-y-4 text-sm h-135 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${msg.from === "right" ? "items-end" : "items-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl mt-1 max-w-xs break-words ${
                msg.from === "right" ? "bg-[#0074B7] text-white" : "bg-gray-200"
              }`}
            >
              {msg.image ? (
                <img src={msg.image} alt="Uploaded" className="rounded-lg max-w-full" />
              ) : (
                msg.text
              )}
            </div>
            <span className="text-xs text-gray-500 mt-1">{msg.time}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="flex items-center p-4 border-t gap-3">
        <label htmlFor="file-upload" className="cursor-pointer">
          <img src={paperClipOutlined} alt="Attach" className="w-5 h-5" />
          <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} />
        </label>

        <input
          type="text"
          placeholder="Type your message here..."
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <img src={fluentEmojiLaugh} alt="Emoji" className="w-5 h-5 cursor-pointer" />
        <img src={fluentCamera} alt="Camera" className="w-5 h-5 cursor-pointer" />
        <button
          className="bg-[#0074B7] text-white px-3 py-2 rounded-full text-sm"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBoxUser;
