'use client';

import type {User} from 'firebase/auth';
import {useState, useEffect} from 'react';
import type {ChatMessage} from '@/types';
import {ChatList} from '@/components/chat-list';
import {ChatInput} from '@/components/chat-input';
import {getChatHistory, submitMessage} from '@/app/actions';

interface ChatProps {
  user: User;
}

export function Chat({user}: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getChatHistory(user.uid);
        setMessages(history);
      } catch (error) {
        console.error('Failed to load chat history:', error);
      } finally {
        setIsHistoryLoading(false);
      }
    };
    loadHistory();
  }, [user.uid]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

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
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ChatList messages={messages} isLoading={isLoading} isHistoryLoading={isHistoryLoading} user={user} />
      <div className="border-t bg-card p-4">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
