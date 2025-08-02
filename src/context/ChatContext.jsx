// ChatContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`messages_${user._id}`);
      if (saved) setMessages(JSON.parse(saved));
    } else {
      setMessages([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`messages_${user._id}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  const sendMessage = async (message) => {
    if (!message.trim() || !user) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setTyping(true);
    setLoading(true);

    try {
      const res = await api.post('/chat/ask', { prompt: message });

      const aiMessage = {
        id: Date.now() + 1,
        text: res.data.response,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('AI error:', err);
      const errorMsg = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble responding right now.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setTyping(false);
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    if (user) localStorage.removeItem(`messages_${user._id}`);
  };

  return (
    <ChatContext.Provider value={{ messages, loading, typing, sendMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
};
