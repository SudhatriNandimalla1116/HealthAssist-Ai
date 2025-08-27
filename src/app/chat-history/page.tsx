
import { AppLayout } from '@/components/app-layout';
import { ChatHistoryClient } from '@/components/chat-history-client';

export default function ChatHistoryPage() {
  return (
    <AppLayout>
      <div className="p-4 md:p-6">
        <h2 className="text-2xl font-bold tracking-tight">Chat History</h2>
        <p className="text-muted-foreground">
          Review your past conversations with HealthAssist AI.
        </p>
      </div>
      <div className="flex-1 p-4 pt-0 md:p-6 md:pt-0">
        <ChatHistoryClient />
      </div>
    </AppLayout>
  );
}
