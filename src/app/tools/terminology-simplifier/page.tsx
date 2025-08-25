'use client';

import {useAuth} from '@/hooks/use-auth';
import {AppLayout} from '@/components/app-layout';
import {TerminologySimplifier} from '@/components/terminology-simplifier';
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

export default function TerminologySimplifierPage() {
  const {loading} = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Medical Terminology Simplifier
        </h2>
        <p className="text-muted-foreground">
          Break down complex medical jargon into simple, understandable language.
        </p>
      </div>
      <TerminologySimplifier />
    </AppLayout>
  );
}
