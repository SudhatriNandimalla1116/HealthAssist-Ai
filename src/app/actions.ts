'use server';

import {db} from '@/lib/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import {emergencyTriage} from '@/ai/flows/emergency-triage';
import {symptomToCondition} from '@/ai/flows/symptom-to-condition';
import type {ChatMessage} from '@/types';

export async function submitMessage(
  userId: string,
  content: string
): Promise<ChatMessage> {
  // 1. Save user message to Firestore
  const userMessage: Omit<ChatMessage, 'id' | 'createdAt'> = {
    role: 'user',
    content,
    createdAt: serverTimestamp(),
  };
  await addDoc(collection(db, 'users', userId, 'messages'), userMessage);

  // 2. Perform emergency triage
  const triageResult = await emergencyTriage({userInput: content});

  let aiResponse: Omit<ChatMessage, 'id' | 'createdAt'>;

  if (triageResult.isEmergency) {
    // 3a. If emergency, create emergency response
    aiResponse = {
      role: 'assistant',
      content: triageResult.response,
      isEmergency: true,
      disclaimer: triageResult.response, // Use the direct response as disclaimer for emphasis
      createdAt: serverTimestamp(),
    };
  } else {
    // 3b. If not emergency, get potential conditions
    const conditionResult = await symptomToCondition({symptoms: content});
    aiResponse = {
      role: 'assistant',
      content: conditionResult.potentialConditions,
      isEmergency: false,
      disclaimer: conditionResult.disclaimer,
      createdAt: serverTimestamp(),
    };
  }

  // 4. Save AI response to Firestore
  const docRef = await addDoc(collection(db, 'users', userId, 'messages'), aiResponse);

  // 5. Return the full AI response object to the client
  return {
    ...aiResponse,
    id: docRef.id,
    createdAt: new Date(), // Return a client-side date for immediate rendering
  } as ChatMessage;
}

export async function getChatHistory(userId: string): Promise<ChatMessage[]> {
  const messagesRef = collection(db, 'users', userId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'), limit(50));
  const querySnapshot = await getDocs(q);

  const history: ChatMessage[] = [];
  querySnapshot.forEach(doc => {
    const data = doc.data();
    history.push({
      id: doc.id,
      ...data,
      // Convert Firestore Timestamp to JS Date
      createdAt: data.createdAt.toDate(),
    } as ChatMessage);
  });

  return history;
}
