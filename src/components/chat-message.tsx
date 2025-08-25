import type {ChatMessage as ChatMessageT} from '@/types';
import {cn} from '@/lib/utils';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Bot, User as UserIcon, AlertTriangle} from 'lucide-react';
import {Alert, AlertDescription} from './ui/alert';
import type {User} from 'firebase/auth';

interface ChatMessageProps {
  message: ChatMessageT;
  user: Partial<User>;
}

export function ChatMessage({message, user}: ChatMessageProps) {
  const isUser = message.role === 'user';
  return (
    <div
      className={cn(
        'flex items-start gap-3',
        isUser ? 'justify-end' : 'justify-start',
        'animate-in fade-in slide-in-from-bottom-4 duration-500'
      )}
    >
      {!isUser && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
          <Bot className="h-6 w-6" />
        </div>
      )}
      <div className={cn('flex max-w-lg flex-col gap-1', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-xl px-4 py-3',
            isUser ? 'rounded-br-none bg-primary text-primary-foreground' : 'rounded-bl-none bg-card shadow-sm'
          )}
        >
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        </div>
        {!isUser && message.disclaimer && (
          <Alert variant={message.isEmergency ? 'destructive' : 'default'} className="mt-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">{message.disclaimer}</AlertDescription>
          </Alert>
        )}
      </div>
      {isUser && (
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
          <AvatarFallback>
            {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon />}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
