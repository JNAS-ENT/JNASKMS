import { useState } from 'react';
import { useEnterpriseStore } from '../../../store';
import { chatApi } from '../api';
import { ChatMessage } from '../../../types';

export function useChat() {
  const { chatMessages, setChatMessages } = useEnterpriseStore();
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isSending) return;

    // Append User Message
    const userMsg: ChatMessage = {
      id: `c-u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsSending(true);

    try {
      const reply = await chatApi.sendMessage(text);
      setChatMessages(prev => [...prev, reply]);
    } catch (e) {
      console.error(e);
      // Append fallback error
      const errorMsg: ChatMessage = {
        id: `c-e-${Date.now()}`,
        role: 'assistant',
        content: 'System error: Unable to connect to model server. Try verifying network bounds.',
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const clearHistory = () => {
    setChatMessages([
      {
        id: 'c-1',
        role: 'assistant',
        content: 'Welcome to the enterprise command center! I am your AI architect agent. How can I assist with your design reviews, notes analysis, or project planning today?',
        timestamp: new Date().toISOString()
      }
    ]);
  };

  return {
    messages: chatMessages,
    isSending,
    sendMessage,
    clearHistory
  };
}
