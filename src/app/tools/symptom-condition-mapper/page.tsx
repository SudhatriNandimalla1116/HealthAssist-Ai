'use client';

import {useAuth} from '@/hooks/use-auth';
import {SignIn} from '@/components/sign-in';
import {AppLayout} from '@/components/app-layout';
import {SymptomConditionMapper} from '@/components/symptom-condition-mapper';
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

export default function SymptomConditionMapperPage() {
  const {user, loading} = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <SignIn />;
  }

  return (
    <AppLayout user={user}>
      <div className="p-4 md:p-6">
        <h2 className="text-2xl font-bold tracking-tight">Symptom to Condition Mapper</h2>
        <p className="text-muted-foreground">
          Enter your symptoms to see a list of potential related medical conditions.
        </p>
      </div>
      <SymptomConditionMapper />
    </AppLayout>
  );
}
