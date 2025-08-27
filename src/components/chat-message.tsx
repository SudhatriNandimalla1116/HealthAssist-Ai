import type {ChatMessage as ChatMessageT} from '@/types';
import {cn} from '@/lib/utils';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Bot, User as UserIcon, AlertTriangle, Volume2, Play} from 'lucide-react';
import {Alert, AlertDescription} from './ui/alert';
import type {User} from 'firebase/auth';
import React, {useRef, useState, useEffect} from 'react';
import {Button} from './ui/button';

interface ChatMessageProps {
  message: ChatMessageT;
  user: Partial<User> | {uid: string; photoURL?: string; displayName?: string};
}

export function ChatMessage({message, user}: ChatMessageProps) {
  const isUser = message.role === 'user';
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } else {
        audioRef.current.play();
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const onPlay = () => setIsPlaying(true);
      const onPause = () => setIsPlaying(false);
      const onEnded = () => setIsPlaying(false);

      audio.addEventListener('play', onPlay);
      audio.addEventListener('pause', onPause);
      audio.addEventListener('ended', onEnded);
      
      if (!isUser && message.audioUrl) {
        audio.play().catch(e => console.error("Audio autoplay failed:", e));
      }

      return () => {
        audio.removeEventListener('play', onPlay);
        audio.removeEventListener('pause', onPause);
        audio.removeEventListener('ended', onEnded);
      };
    }
  }, [message.audioUrl, isUser]);

  return (
    <div
      className={cn(
        'flex items-start gap-3',
        isUser ? 'justify-end' : 'justify-start',
        'animate-in fade-in slide-in-from-bottom-4 duration-500'
      )}
    >
      {!isUser && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-primary border border-blue-500/30">
          <Bot className="h-6 w-6" />
        </div>
      )}
      <div className={cn('flex max-w-lg flex-col gap-1', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-xl px-4 py-3',
            isUser 
              ? 'rounded-br-none button-blue-gradient text-white shadow-lg' 
              : 'rounded-bl-none bg-card shadow-sm border border-blue-500/20'
          )}
        >
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
          {!isUser && message.audioUrl && (
            <>
              <audio ref={audioRef} src={message.audioUrl} className="hidden" />
              <Button 
                onClick={handlePlayAudio} 
                variant="ghost" 
                size="icon" 
                className="mt-2 h-8 w-8 text-blue-500 hover:bg-blue-500/10 hover:text-blue-400"
              >
                {isPlaying ? <Volume2 className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
              </Button>
            </>
          )}
        </div>

        {!isUser && message.disclaimer && (
          <Alert 
            variant={message.isEmergency ? 'destructive' : 'default'} 
            className="mt-2 border-blue-500/20 bg-blue-500/5"
          >
            <AlertTriangle className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-xs text-blue-200">{message.disclaimer}</AlertDescription>
          </Alert>
        )}
      </div>
      {isUser && (
        <Avatar className="h-10 w-10 border-2 border-blue-500/30">
          <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
          <AvatarFallback className="bg-blue-500/20 text-blue-300">
            {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon />}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
