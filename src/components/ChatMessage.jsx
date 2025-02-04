// src/components/ChatMessage.js
import React from "react";

const ChatMessage = ({ message, type }) => {
  const bgColor = type === "question" ? "bg-white" : "bg-blue-100";
  const textColor = type === "question" ? "text-black" : "text-blue-800";

  return (
    <div className={`p-3 my-2 rounded-lg shadow ${bgColor} ${textColor}`}>
      {message}
    </div>
  );
};

export default ChatMessage;
