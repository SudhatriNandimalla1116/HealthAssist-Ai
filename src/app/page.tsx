
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bot, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center blue-gradient text-foreground">
      <div className="flex flex-col items-center gap-8 rounded-lg bg-card p-12 shadow-lg card-blue-glow border border-blue-500/20 max-w-md mx-4">
        <div className="p-4 rounded-full bg-blue-500/10 border border-blue-500/20">
          <Bot className="h-16 w-16 text-primary" />
        </div>
        
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            AI Chat
          </h1>
          <p className="text-lg text-muted-foreground">
            Your personal AI-powered health assistant.
          </p>
        </div>
        
        <Button 
          asChild 
          size="lg" 
          className="button-blue-gradient text-white border-0 hover:scale-105 transition-transform px-8 py-3 text-lg"
        >
          <Link href="/chat" className="flex items-center gap-2">
            Let's Chat
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
