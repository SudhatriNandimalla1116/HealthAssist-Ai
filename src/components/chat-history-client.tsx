'use client';

import { ChatList } from '@/components/chat-list';
import { Card, CardContent } from '@/components/ui/card';
import type { ChatMessage } from '@/types';
import { useState, useEffect, useCallback } from 'react';

const CHAT_HISTORY_KEY = 'health-assist-chat-history';

export function ChatHistoryClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  const loadHistory = useCallback(() => {
    try {
      const savedMessages = localStorage.getItem(CHAT_HISTORY_KEY);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          createdAt: new Date(msg.createdAt),
        }));
        setMessages(parsedMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to load chat history from localStorage', error);
      setMessages([]);
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();

    const onCustomUpdate = () => loadHistory();
    const onStorage = (e: StorageEvent) => {
      if (e.key === CHAT_HISTORY_KEY) loadHistory();
    };

    window.addEventListener('health-assist-chat-history-updated', onCustomUpdate);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('health-assist-chat-history-updated', onCustomUpdate);
      window.removeEventListener('storage', onStorage);
    };
  }, [loadHistory]);

  return (
    <Card className="h-full border-blue-500/20 bg-card/50">
      <CardContent className="h-full p-0">
        <ChatList
          messages={messages}
          isLoading={false}
          isHistoryLoading={isHistoryLoading}
          user={{ uid: 'anonymous' }}
        />
      </CardContent>
    </Card>
  );
}
