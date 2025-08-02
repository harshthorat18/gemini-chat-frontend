import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const ChatMessage = ({ message, onDelete, isUser }) => {
  const timeAgo = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });

  return (
    <div className={`d-flex ${isUser ? 'justify-content-end' : 'justify-content-start'} mb-3`}>
      <div
        className={`p-3 rounded shadow-sm ${
          isUser ? 'bg-primary text-white' : 'bg-light text-dark'
        }`}
        style={{ maxWidth: '80%', minWidth: '200px' }}
      >
        <div className="d-flex justify-content-between align-items-start mb-1">
          <strong>{isUser ? 'You' : 'Gemini'}</strong>
          {!isUser && onDelete && (
            <button
              onClick={() => onDelete(message._id)}
              className="btn btn-sm btn-outline-light ms-2 p-1 border-0"
              title="Delete"
              aria-label="Delete message"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16" height="16"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
        <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{message.content}</div>
        <div className="mt-1 text-muted small">{timeAgo}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
