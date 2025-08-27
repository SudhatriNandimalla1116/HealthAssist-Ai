'use client';

import type {User} from 'firebase/auth';
import {useState, useEffect, useCallback, useMemo} from 'react';
import type {ChatMessage} from '@/types';
import {ChatList} from '@/components/chat-list';
import {ChatInput} from '@/components/chat-input';
import {submitMessage} from '@/app/actions';

interface ChatProps {
  user: Partial<User> | {uid: string};
}

const CHAT_HISTORY_KEY = 'health-assist-chat-history';

export function Chat({user}: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  // Memoize welcome message to prevent recreation
  const welcomeMessage = useMemo<ChatMessage>(() => ({
    id: 'welcome',
    role: 'assistant',
    content: 'Hello! I\'m your HealthAssist AI. I\'m here to help you with health-related questions and concerns. How are you feeling today?',
    createdAt: new Date(),
  }), []);

  // Load messages from localStorage on initial render
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(CHAT_HISTORY_KEY);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages).map((msg: ChatMessage) => ({
          ...msg,
          createdAt: new Date(msg.createdAt),
        }));
        setMessages(parsedMessages);
      } else {
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error("Failed to load chat history from localStorage", error);
      setMessages([welcomeMessage]);
    }
    setIsHistoryLoading(false);
  }, [welcomeMessage]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (!isHistoryLoading) {
        try {
            localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
        } catch (error) {
            console.error("Failed to save chat history to localStorage", error);
        }
    }
  }, [messages, isHistoryLoading]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !user.uid) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await submitMessage(user.uid, content);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        createdAt: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [user.uid]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ChatList messages={messages} isLoading={isLoading} isHistoryLoading={isHistoryLoading} user={user} />
      <div className="border-t border-blue-500/20 bg-card p-4">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
