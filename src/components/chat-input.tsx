'use client';

import {useState, useRef, type FormEvent, useEffect} from 'react';
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

  useEffect(() => {
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

      recognitionRef.current = recognition;
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      // Clear message before starting new recording
      setMessage('');
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isRecording) {
      recognitionRef.current?.stop();
    }
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-4">
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isRecording ? 'Listening...' : 'Type your symptoms here...'}
        className="flex-1 resize-none"
        rows={1}
        disabled={isLoading}
      />
      {recognitionRef.current && (
        <Button
          type="button"
          onClick={toggleRecording}
          disabled={isLoading}
          size="icon"
          variant={isRecording ? 'destructive' : 'outline'}
          className={cn(isRecording && 'text-red-500 animate-pulse')}
        >
          {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          <span className="sr-only">{isRecording ? 'Stop recording' : 'Start recording'}</span>
        </Button>
      )}
      <Button type="submit" disabled={isLoading || !message.trim()} size="icon">
        <Send className="h-5 w-5" />
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
}
