'use client';

import { ChatList } from '@/components/chat-list';
import { Card, CardContent } from '@/components/ui/card';
import type { ChatMessage } from '@/types';
import { useState, useEffect } from 'react';

const CHAT_HISTORY_KEY = 'health-assist-chat-history';

export function ChatHistoryClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(CHAT_HISTORY_KEY);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages).map((msg: ChatMessage) => ({
          ...msg,
          createdAt: new Date(msg.createdAt),
        }));
        setMessages(parsedMessages);
      }
    } catch (error) {
      console.error("Failed to load chat history from localStorage", error);
    }
    setIsHistoryLoading(false);
  }, []);

  return (
    <Card className="h-full">
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
