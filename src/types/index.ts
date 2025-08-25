import type {Timestamp} from 'firebase/firestore';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isEmergency?: boolean;
  disclaimer?: string;
  createdAt: Timestamp | Date;
}

export interface HealthDataPoint {
  id: string;
  weight: number;
  systolic: number;
  diastolic: number;
  mood: number; // e.g., 1 to 5 scale
  createdAt: Timestamp | Date;
}
