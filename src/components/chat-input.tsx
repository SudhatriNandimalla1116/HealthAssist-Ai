'use client';

import {useState, useRef, type FormEvent, useEffect, useCallback, useMemo} from 'react';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Send, Mic, MicOff} from 'lucide-react';
import {cn} from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({onSendMessage, isLoading}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Memoize speech recognition setup
  const setupSpeechRecognition = useMemo(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = event => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setMessage(prev => prev + finalTranscript + interimTranscript);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      return recognition;
    }
    return null;
  }, []);

  useEffect(() => {
    recognitionRef.current = setupSpeechRecognition;
    return () => {
      recognitionRef.current?.stop();
    };
  }, [setupSpeechRecognition]);

  const toggleRecording = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setMessage('');
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  }, [isRecording]);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (isRecording) {
      recognitionRef.current?.stop();
    }
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      textareaRef.current?.focus();
    }
  }, [isRecording, message, onSendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  const placeholder = useMemo(() => 
    isRecording ? 'Listening...' : 'Tell me how you\'re feeling or what you need help with...',
    [isRecording]
  );

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-4">
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 resize-none border-blue-500/20 focus:border-blue-500/50 focus:ring-blue-500/20"
        rows={1}
        disabled={isLoading}
      />
      {setupSpeechRecognition && (
        <Button
          type="button"
          onClick={toggleRecording}
          disabled={isLoading}
          size="icon"
          variant={isRecording ? 'destructive' : 'outline'}
          className={cn(
            isRecording && 'text-red-500 animate-pulse',
            'border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/40'
          )}
        >
          {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          <span className="sr-only">{isRecording ? 'Stop recording' : 'Start recording'}</span>
        </Button>
      )}
      <Button 
        type="submit" 
        disabled={isLoading || !message.trim()} 
        size="icon"
        className="button-blue-gradient text-white border-0 hover:scale-105 transition-transform"
      >
        <Send className="h-5 w-5" />
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
}
