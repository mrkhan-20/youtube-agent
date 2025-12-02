import React from "react";

const MessageBubble = ({ role, text }) => {
  const isUser = role === "user";

  return (
    <div className={`message-wrapper ${isUser ? "user-message" : "assistant-message"}`}>
      <div className={`message-bubble ${isUser ? "user" : "assistant"}`}>
        <div className="message-header">
          <span className="message-role">
            {isUser ? (
              <>
                <span className="role-icon">👤</span>
                You
              </>
            ) : (
              <>
                <span className="role-icon">🤖</span>
                Video Twin
              </>
            )}
          </span>
        </div>
        <div className="message-content">{text}</div>
      </div>
    </div>
  );
};

export default MessageBubble;
