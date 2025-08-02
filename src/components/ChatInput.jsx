import React, { useState, useRef } from 'react';

const ChatInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex gap-2 align-items-end">
      <div className="flex-grow-1 w-100">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            autoResize();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="form-control bg-dark text-light border-secondary"
          rows={1}
          disabled={disabled}
          style={{ resize: 'none', overflow: 'hidden' }}
        />
      </div>
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="btn btn-primary px-4"
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;
