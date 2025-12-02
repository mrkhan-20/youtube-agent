import React, { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../services/api";
import MessageBubble from "./MessageBubble";

const Chat = ({ videoId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const newMessage = { role: "user", content: input.trim() };
    const history = [...messages, newMessage];

    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      const resp = await sendChatMessage(videoId, newMessage.content, history);
      const assistantReply = {
        role: "assistant",
        content: resp.data.answer,
      };
      setMessages((prev) => [...prev, assistantReply]);
    } catch (err) {
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2 className="chat-title">
          <span className="chat-icon">💬</span>
          Chat with the Video Twin
        </h2>
        {messages.length > 0 && (
          <button
            className="clear-chat-btn"
            onClick={() => {
              setMessages([]);
              setInput("");
            }}
            title="Clear chat history"
          >
            Clear
          </button>
        )}
      </div>

      <div className="messages-box">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <div className="empty-chat-icon">👋</div>
            <p className="empty-chat-text">Start a conversation about the video!</p>
            <div className="suggestions">
              <p className="suggestions-title">Try asking:</p>
              <div className="suggestion-chips">
                <button
                  className="suggestion-chip"
                  onClick={() => setInput("What is this video about?")}
                >
                  What is this video about?
                </button>
                <button
                  className="suggestion-chip"
                  onClick={() => setInput("Summarize the main points")}
                >
                  Summarize the main points
                </button>
                <button
                  className="suggestion-chip"
                  onClick={() => setInput("What are the key takeaways?")}
                >
                  What are the key takeaways?
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble key={i} role={msg.role} text={msg.content} />
            ))}
            {loading && (
              <div className="loading-message">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="loading-text">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="chat-input-container">
        <div className="input-wrapper-chat">
          <input
            ref={inputRef}
            className="chat-input"
            type="text"
            placeholder="Ask something about the video..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={loading}
            autoFocus
          />
          <button
            className={`send-btn ${loading || !input.trim() ? "disabled" : ""}`}
            onClick={handleSend}
            disabled={loading || !input.trim()}
            title="Send message (Enter)"
          >
            <span className="send-icon">➤</span>
          </button>
        </div>
        <div className="input-hint">Press Enter to send, Shift+Enter for new line</div>
      </div>
    </div>
  );
};

export default Chat;
