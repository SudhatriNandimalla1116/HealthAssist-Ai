'use client';

import { AppLayout } from '@/components/app-layout';
import { ChatHistoryClient } from '@/components/chat-history-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const CHAT_HISTORY_KEY = 'health-assist-chat-history';

function DebugSection() {
  const [localStorageData, setLocalStorageData] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string>('');

  const loadDebugInfo = () => {
    try {
      if (typeof window === 'undefined') {
        setDebugInfo('Window is undefined (SSR)');
        return;
      }

      if (!window.localStorage) {
        setDebugInfo('localStorage is not available');
        return;
      }

      const data = localStorage.getItem(CHAT_HISTORY_KEY);
      setLocalStorageData(data || 'No data found');
      setDebugInfo(`localStorage available: ${!!window.localStorage}, Data length: ${data?.length || 0}`);
    } catch (error) {
      setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const addTestMessage = () => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        setDebugInfo('localStorage not available');
        return;
      }

      const existingData = localStorage.getItem(CHAT_HISTORY_KEY);
      const messages = existingData ? JSON.parse(existingData) : [];
      
      const newMessage = {
        id: `test-${Date.now()}`,
        role: 'user' as const,
        content: 'Test message from debug tool',
        createdAt: new Date().toISOString(),
      };

      messages.push(newMessage);
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
      setDebugInfo(`Test message added. Total messages: ${messages.length}`);
      loadDebugInfo();
    } catch (error) {
      setDebugInfo(`Error adding test message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const clearLocalStorage = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(CHAT_HISTORY_KEY);
        setLocalStorageData('');
        setDebugInfo('localStorage cleared');
      }
    } catch (error) {
      setDebugInfo(`Error clearing localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    loadDebugInfo();
  }, []);

  return (
    <Card className="mb-6 border-orange-500/20">
      <CardHeader>
        <CardTitle className="text-orange-600">🔧 Debug Tool (Temporary)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={addTestMessage} variant="outline" size="sm">
            Add Test Message
          </Button>
          <Button onClick={loadDebugInfo} variant="outline" size="sm">
            Refresh Debug Info
          </Button>
          <Button onClick={clearLocalStorage} variant="destructive" size="sm">
            Clear localStorage
          </Button>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Debug Info:</div>
          <div className="p-2 bg-muted rounded text-xs font-mono">
            {debugInfo}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">localStorage Data:</div>
          <div className="p-2 bg-muted rounded text-xs font-mono max-h-32 overflow-auto">
            {localStorageData || 'No data'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ChatHistoryPage() {
  return (
    <AppLayout>
      <div className="p-4 md:p-6 border-b border-blue-500/20">
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Chat History
        </h2>
        <p className="text-muted-foreground">
          Review your past conversations with HealthAssist AI.
        </p>
      </div>
      <div className="flex-1 p-4 pt-0 md:p-6 md:pt-0">
        <DebugSection />
        <ChatHistoryClient />
      </div>
    </AppLayout>
  );
}
