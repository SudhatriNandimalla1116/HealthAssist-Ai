'use server';

import {
  serverTimestamp,
} from 'firebase/firestore';
import {emergencyTriage} from '@/ai/flows/emergency-triage';
import {simplifyMedicalTerminology} from '@/ai/flows/medical-terminology-simplifier';
import {mapSymptoms, type MapSymptomsOutput} from '@/ai/flows/map-symptoms';
import type {ChatMessage} from '@/types';

export async function submitMessage(
  userId: string,
  content: string
): Promise<ChatMessage> {
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
    const conditionResult = await mapSymptoms({symptoms: content});
    aiResponse = {
      role: 'assistant',
      content: conditionResult.potentialConditions,
      isEmergency: false,
      disclaimer: conditionResult.disclaimer,
      createdAt: serverTimestamp(),
    };
  }

  // 5. Return the full AI response object to the client
  return {
    ...aiResponse,
    id: `ai-${Date.now()}`,
    createdAt: new Date(), // Return a client-side date for immediate rendering
  } as ChatMessage;
}

export async function simplifyTerminologyAction(
  medicalText: string
): Promise<string> {
  if (!medicalText.trim()) {
    return '';
  }
  try {
    const result = await simplifyMedicalTerminology({medicalText});
    return result.simplifiedText;
  } catch (error) {
    console.error('Error simplifying terminology:', error);
    // Return a user-friendly error message
    return 'An error occurred while simplifying the text. Please try again later.';
  }
}

export async function mapSymptomsAction(
  symptoms: string
): Promise<MapSymptomsOutput> {
  if (!symptoms.trim()) {
    return {potentialConditions: '', disclaimer: ''};
  }
  try {
    const result = await mapSymptoms({symptoms});
    return result;
  } catch (error) {
    console.error('Error mapping symptoms:', error);
    return {
      potentialConditions:
        'An error occurred while analyzing your symptoms. Please try again later.',
      disclaimer:
        'This AI is for informational purposes only and does not provide medical advice. Consult a healthcare professional for any medical concerns.',
    };
  }
}
