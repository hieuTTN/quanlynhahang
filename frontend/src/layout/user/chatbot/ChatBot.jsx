import React, { useState } from "react";
import "./ChatBot.css";
import { postMethodPayload } from "../../../services/request";

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = [
    "Menu hôm nay có món gì ngon?",
    "Nhà hàng còn bàn trống không hôm nay?",
    "Tôi muốn đặt bàn ngày mai lúc 7h tối.",
    "Ngày 6/8 có ai đặt bàn chưa?",
    "Còn bàn nào tầng 2 ngày kia không?",
    "Có món ăn nào không cay không?",
    "Gợi ý món nước cho tôi đi.",
    "Nhà hàng có món chay không?",
  ];

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowSuggestions(false);
  };

  const sendMessage = async (message = input.trim()) => {
    if (!message) return;
    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setInput("");
    setShowSuggestions(false);

    const res = await postMethodPayload("/api/chat", { message });
    const data = await res.json();

    setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbox">
          <div className="chat-header">🤖 Hỗ trợ nhà hàng</div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.role}`}>
                <b>{m.role === "user" ? "Bạn" : "Bot"}:</b> {m.text}
              </div>
            ))}
          </div>

          {/* Gợi ý câu hỏi */}
          <div className="chat-suggestions">
            <button onClick={() => setShowSuggestions(!showSuggestions)}>
              💡 Gợi ý câu hỏi
            </button>
            {showSuggestions && (
              <div className="suggestion-list">
                {suggestions.map((s, idx) => (
                  <div key={idx} className="suggestion-item" onClick={() => handleSuggestionClick(s)}>
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              placeholder="Nhập tin nhắn..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={() => sendMessage()}>Gửi</button>
          </div>
        </div>
      )}

      <button className="chat-toggle" onClick={toggleChat}>
        {isOpen ? "✖" : "💬 Hỗ trợ AI"}
      </button>
    </div>
  );
}

export default ChatBot;
