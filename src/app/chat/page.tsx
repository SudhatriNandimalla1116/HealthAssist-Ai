
'use client';

import {useAuth} from '@/hooks/use-auth';
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

function ChatPageContent() {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <AppLayout>
            <div className="flex flex-1 flex-col overflow-hidden">
                <div className="border-b bg-card p-4 md:p-6">
                    <h2 className="text-2xl font-bold tracking-tight">AI Chat</h2>
                    <p className="text-muted-foreground">
                        Your personal AI-powered health assistant.
                    </p>
                </div>
                <div className="p-4 md:p-6">
                    <Alert>
                        <ShieldAlert className="h-4 w-4" />
                        <AlertTitle className="font-semibold">Medical Disclaimer</AlertTitle>
                        <AlertDescription>
                            This AI is for informational purposes only and does not provide medical advice.
                            Consult a healthcare professional for any medical concerns.
                        </AlertDescription>
                    </Alert>
                </div>
                <Chat user={{uid: 'anonymous'}} />
            </div>
        </AppLayout>
    );
}


export default function ChatPage() {
  return <ChatPageContent/>;
}
