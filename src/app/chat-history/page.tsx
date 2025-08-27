
'use client';

import { AppLayout } from '@/components/app-layout';
import { ChatList } from '@/components/chat-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChatMessage } from '@/types';
import { useState, useEffect } from 'react';

const CHAT_HISTORY_KEY = 'health-assist-chat-history';

export default function ChatHistoryPage() {
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
    <AppLayout>
      <div className="p-4 md:p-6">
        <h2 className="text-2xl font-bold tracking-tight">Chat History</h2>
        <p className="text-muted-foreground">
          Review your past conversations with HealthAssist AI.
        </p>
      </div>
      <div className="flex-1 p-4 pt-0 md:p-6 md:pt-0">
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
      </div>
    </AppLayout>
  );
}
