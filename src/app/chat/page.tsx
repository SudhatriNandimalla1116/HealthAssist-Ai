
'use client';

import {useAuth} from '@/hooks/use-auth';
import {Bot} from 'lucide-react';
import {AppLayout} from '@/components/app-layout';
import {Chat} from '@/components/chat';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {ShieldAlert} from 'lucide-react';

function LoadingScreen() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 blue-gradient">
      <div className="p-4 rounded-full bg-blue-500/10 border border-blue-500/20">
        <Bot className="h-12 w-12 animate-pulse text-primary" />
      </div>
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
                <div className="border-b border-blue-500/20 bg-card p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-blue-500/10 border border-blue-500/20">
                            <Bot className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                                AI Chat
                            </h2>
                            <p className="text-lg text-muted-foreground mt-1">
                                Your personal AI-powered health assistant.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-4 md:p-6">
                    <Alert className="border-blue-500/20 bg-blue-500/5">
                        <ShieldAlert className="h-4 w-4 text-blue-500" />
                        <AlertTitle className="font-semibold text-blue-300">Medical Disclaimer</AlertTitle>
                        <AlertDescription className="text-blue-200">
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
