import type {Timestamp} from 'firebase/firestore';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isEmergency?: boolean;
  disclaimer?: string;
  createdAt: Timestamp | Date;
}
