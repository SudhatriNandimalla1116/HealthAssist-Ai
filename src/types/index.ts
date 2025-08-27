// Firebase types are optional - the app can run without Firebase
import type {Timestamp} from 'firebase/firestore';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  audioUrl?: string;
  isEmergency?: boolean;
  disclaimer?: string;
  createdAt: Date;
}

export interface HealthDataPoint {
  id: string;
  weight: number;
  systolic: number;
  diastolic: number;
  mood: number; // e.g., 1 to 5 scale
  createdAt: Date;
}
