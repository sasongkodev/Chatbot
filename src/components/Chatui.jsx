import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FaRobot,
  FaBrain,
  FaComments,
  FaMicrochip,
  FaPaperPlane,
  FaRedo,
} from "react-icons/fa";
import { sendMessageToGemini } from "../services/geminiService";
import ChatMessage from "../components/ChatMessage";
import ResetButton from "../components/ResetButton";

const Card = ({ icon, color, title }) => (
  <div className="bg-white shadow-md rounded-lg p-6 w-64 flex flex-col items-center">
    <div className={`text-2xl mb-2 ${color}`}>{icon}</div>
    <p className="text-gray-700 text-center">{title}</p>
  </div>
);

const Chatui = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Gunakan useCallback untuk mengoptimalkan handleSend
  const handleSend = useCallback(async () => {
    if (message.trim()) {
      const userMessage = { text: message, type: "question" };
      setChatHistory((prev) => [...prev, userMessage]);

      setIsTyping(true); // Animasi mengetik mulai

      try {
        const language = /^[A-Za-z0-9\s]+$/.test(message) ? "en" : "id";
        const result = await sendMessageToGemini(message, language);

        const aiResponse = {
          text: result.reply || "Error fetching response.",
          type: "answer",
        };
        setChatHistory((prev) => [...prev, aiResponse]);
      } catch (error) {
        setChatHistory((prev) => [
          ...prev,
          { text: "Error: Unable to fetch response.", type: "answer" },
        ]);
      } finally {
        setIsTyping(false);
      }

      setMessage("");
    }
  }, [message]);

  const handleReset = () => {
    setChatHistory([]);
    setMessage("");
    setIsTyping(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div className="bg-gray-50 flex flex-col items-center justify-center min-h-screen font-sans p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Chatbot</h1>
        <p className="text-gray-500 mb-6 italic">Your Smart AI Assistant</p>

        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <Card
            icon={<FaRobot />}
            color="text-blue-500"
            title="AI Chat Assistant"
          />
          <Card
            icon={<FaBrain />}
            color="text-green-500"
            title="Knowledge Base"
          />
          <Card
            icon={<FaComments />}
            color="text-purple-500"
            title="Conversational UI"
          />
          <Card
            icon={<FaMicrochip />}
            color="text-red-500"
            title="Advanced AI Features"
          />
        </div>

        <p className="text-gray-500 mb-8">
          Empowering Millions with AI Technology
        </p>
      </div>

      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-4 h-96 overflow-y-auto flex flex-col">
          {chatHistory.map((msg, index) => (
            <React.Fragment key={index}>
              <ChatMessage message={msg.text} type={msg.type} />
            </React.Fragment>
          ))}
          {isTyping && <div className="text-gray-400 italic">Typing...</div>}
          <div ref={chatEndRef} />
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 flex items-center mt-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className="ml-2 p-2 text-blue-500 hover:text-blue-700 transition-colors"
            onClick={handleSend}
          >
            <FaPaperPlane />
          </button>
          <button
            className="ml-2 p-2 text-red-500 hover:text-red-700 transition-colors"
            onClick={handleReset}
          >
            <FaRedo />
          </button>
        </div>
      </div>

      <footer className="mt-8 text-gray-500 text-sm">
        By using this Chatbot, you agree to the Terms and Privacy Policy.
      </footer>
    </div>
  );
};

export default Chatui;
