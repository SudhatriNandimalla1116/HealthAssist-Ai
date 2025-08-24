import type {User} from 'firebase/auth';
import {UserNav} from '@/components/user-nav';
import {Chat} from '@/components/chat';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Bot, ShieldAlert} from 'lucide-react';

interface ChatPageProps {
  user: User;
}

export function ChatPage({user}: ChatPageProps) {
  return (
    <div className="flex h-screen w-screen flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4 shadow-sm md:px-6">
        <div className="flex items-center gap-3">
          <Bot className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">HealthAssist AI</h1>
        </div>
        <UserNav user={user} />
      </header>
      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b bg-card p-4">
          <Alert>
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle className="font-semibold">Medical Disclaimer</AlertTitle>
            <AlertDescription>
              This AI is for informational purposes only and does not provide medical advice.
              Consult a healthcare professional for any medical concerns.
            </AlertDescription>
          </Alert>
        </div>
        <Chat user={user} />
      </main>
    </div>
  );
}
