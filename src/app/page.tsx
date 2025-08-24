'use client';

import {useAuth} from '@/hooks/use-auth';
import {SignIn} from '@/components/sign-in';
import {ChatPage} from '@/components/chat-page';
import {Bot} from 'lucide-react';

function LoadingScreen() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-background">
      <Bot className="h-12 w-12 animate-pulse text-primary" />
      <p className="text-lg font-medium text-muted-foreground">
        HealthAssist AI is waking up...
      </p>
    </div>
  );
}

export default function Home() {
  const {user, loading} = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <SignIn />;
  }

  return <ChatPage user={user} />;
}
