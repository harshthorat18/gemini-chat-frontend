import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ChatInput from '../components/ChatInput';
import ChatMessage from '../components/ChatMessage';
import Toast from '../components/Toast';

const ChatPage = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChatHistory();
  }, [token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const response = await api.get('/chat/history');
      setMessages(response.data.messages || []);
    } catch (error) {
      setToast({ message: 'Failed to load chat history', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    const userMessage = {
      id: Date.now(),
      content,
      timestamp: new Date(),
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setSending(true);

    try {
      const response = await api.post('/chat', { message: content });
      const aiMessage = {
        id: response.data.id,
        content: response.data.content,
        timestamp: new Date(response.data.timestamp),
        isUser: false,
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setToast({ message: 'Failed to send message', type: 'error' });
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await api.delete(`/chat/message/${messageId}`);
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
      setToast({ message: 'Message deleted', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to delete message', type: 'error' });
    }
  };

  const handleClearChat = async () => {
    try {
      await api.delete('/chat/clear');
      setMessages([]);
      setToast({ message: 'Chat history cleared', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to clear chat', type: 'error' });
    }
  };

  const closeToast = () => setToast(null);

  return (
    <div className="container py-4 text-white bg-dark min-vh-100">
      <div className="card bg-secondary text-white">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Chat with Gemini</h5>
          {messages.length > 0 && (
            <button onClick={handleClearChat} className="btn btn-sm btn-outline-danger">
              Clear Chat
            </button>
          )}
        </div>

        <div className="card-body overflow-auto" style={{ height: '400px' }}>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <LoadingSpinner />
            </div>
          ) : messages.length === 0 ? (
            <div className="d-flex flex-column justify-content-center align-items-center h-100 text-muted">
              <div className="display-4 mb-3">💬</div>
              <p>No messages yet</p>
              <small>Start a conversation with Gemini</small>
            </div>
          ) : (
            <div>
              {messages.map(message => (
                <ChatMessage
                  key={message._id || message.id}
                  message={message}
                  onDelete={!message.isUser && message._id ? () => handleDeleteMessage(message._id) : null}
                  isUser={message.isUser}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="card-footer bg-dark border-top">
          <ChatInput onSendMessage={handleSendMessage} disabled={sending} />
          {sending && (
            <div className="mt-2 d-flex align-items-center text-muted">
              <LoadingSpinner />
              <span className="ms-2">Gemini is thinking...</span>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </div>
  );
};

export default ChatPage;
