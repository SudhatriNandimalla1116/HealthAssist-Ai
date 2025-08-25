'use client';

import {useAuth} from '@/hooks/use-auth';
import {SignIn} from '@/components/sign-in';
import {Bot} from 'lucide-react';
import {AppLayout} from '@/components/app-layout';
import {Chat} from '@/components/chat';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {ShieldAlert} from 'lucide-react';

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

  return (
    <AppLayout user={user}>
      <div className="flex flex-1 flex-col overflow-hidden">
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
      </div>
    </AppLayout>
  );
}
