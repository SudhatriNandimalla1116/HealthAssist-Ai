'use client';

import {useRef, useEffect, useCallback, useMemo} from 'react';
import {ScrollArea} from '@/components/ui/scroll-area';
import {ChatMessage as ChatMessageT} from '@/types';
import {ChatMessage} from '@/components/chat-message';
import {Skeleton} from './ui/skeleton';
import {Bot} from 'lucide-react';
import type {User} from 'firebase/auth';

interface ChatListProps {
  messages: ChatMessageT[];
  isLoading: boolean;
  isHistoryLoading: boolean;
  user: Partial<User> | {uid: string; photoURL?: string; displayName?: string};
}

const LoadingBubble = () => (
  <div className="flex items-start gap-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-primary border border-blue-500/30">
      <Bot className="h-6 w-6" />
    </div>
    <div className="flex items-center gap-1.5 pt-2.5">
      <span className="h-2 w-2 animate-[bounce_1s_infinite] rounded-full bg-blue-400"></span>
      <span className="h-2 w-2 animate-[bounce_1s_infinite_200ms] rounded-full bg-blue-400"></span>
      <span className="h-2 w-2 animate-[bounce_1s_infinite_400ms] rounded-full bg-blue-400"></span>
    </div>
  </div>
);

const HistorySkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-start gap-3 justify-end">
      <Skeleton className="h-12 w-1/2 rounded-lg bg-blue-500/10" />
      <Skeleton className="h-10 w-10 rounded-full bg-blue-500/10" />
    </div>
    <div className="flex items-start gap-3">
      <Skeleton className="h-10 w-10 rounded-full bg-blue-500/10" />
      <Skeleton className="h-12 w-2/3 rounded-lg bg-blue-500/10" />
    </div>
    <div className="flex items-start gap-3 justify-end">
      <Skeleton className="h-8 w-1/3 rounded-lg bg-blue-500/10" />
      <Skeleton className="h-10 w-10 rounded-full bg-blue-500/10" />
    </div>
  </div>
);

export function ChatList({messages, isLoading, isHistoryLoading, user}: ChatListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Memoize the messages list to prevent unnecessary re-renders
  const messagesList = useMemo(() => (
    <div className="space-y-6">
      {messages.map(message => (
        <ChatMessage key={message.id} message={message} user={user} />
      ))}
      {isLoading && <LoadingBubble />}
    </div>
  ), [messages, isLoading, user]);

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef} viewportRef={viewportRef}>
      <div className="p-4 md:p-6">
        {isHistoryLoading ? (
          <HistorySkeleton />
        ) : (
          messagesList
        )}
      </div>
    </ScrollArea>
  );
}
