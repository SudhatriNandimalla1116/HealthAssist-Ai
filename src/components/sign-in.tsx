'use client';

import {signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
import {auth} from '@/lib/firebase';
import {Button} from '@/components/ui/button';
import {useToast} from '@/hooks/use-toast';
import {GoogleIcon} from './icons';
import {Bot} from 'lucide-react';

export function SignIn() {
  const {toast} = useToast();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: 'Could not sign in with Google. Please try again.',
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm rounded-lg border bg-card p-8 shadow-lg">
        <div className="mb-8 flex flex-col items-center justify-center gap-2">
          <Bot className="h-12 w-12 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Welcome to HealthAssist AI</h1>
          <p className="text-center text-muted-foreground">
            Sign in to start your session.
          </p>
        </div>
        <Button onClick={handleSignIn} className="w-full" size="lg">
          <GoogleIcon className="mr-2 h-5 w-5" />
          Sign In with Google
        </Button>
      </div>
    </div>
  );
}
