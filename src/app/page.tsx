
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-6 rounded-lg bg-card p-12 shadow-lg">
        <Bot className="h-16 w-16 text-primary" />
        <div className="text-center">
          <h1 className="text-3xl font-bold">Hi, how are you?</h1>
          <p className="mt-2 text-lg text-muted-foreground">How can I help you today?</p>
        </div>
        <Button asChild size="lg">
          <Link href="/chat">Let's Chat</Link>
        </Button>
      </div>
    </div>
  );
}
