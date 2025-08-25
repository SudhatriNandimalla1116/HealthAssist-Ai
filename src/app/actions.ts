'use server';

import {emergencyTriage} from '@/ai/flows/emergency-triage';
import {simplifyMedicalTerminology} from '@/ai/flows/medical-terminology-simplifier';
import {mapSymptoms, type MapSymptomsOutput} from '@/ai/flows/map-symptoms';
import type {ChatMessage, HealthDataPoint} from '@/types';

export async function submitMessage(
  userId: string,
  content: string
): Promise<ChatMessage> {
  const triageResult = await emergencyTriage({userInput: content});

  let aiResponse: Omit<ChatMessage, 'id' | 'createdAt'>;

  if (triageResult.isEmergency) {
    aiResponse = {
      role: 'assistant',
      content: triageResult.response,
      isEmergency: true,
      disclaimer: triageResult.response,
    };
  } else {
    const conditionResult = await mapSymptoms({symptoms: content});
    aiResponse = {
      role: 'assistant',
      content: conditionResult.potentialConditions,
      isEmergency: false,
      disclaimer: conditionResult.disclaimer,
    };
  }

  return {
    ...aiResponse,
    id: `ai-${Date.now()}`,
    createdAt: new Date(),
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

export async function addHealthDataPoint(
  data: Omit<HealthDataPoint, 'id' | 'createdAt'>
): Promise<HealthDataPoint> {
  console.log('Adding health data (anonymous):', data);
  // In a real app, this would save to Firestore under the user's ID.
  // For anonymous users, we'll just return it with a client-side date.
  const newDataPoint: HealthDataPoint = {
    ...data,
    id: `health-${Date.now()}`,
    createdAt: new Date(),
  };
  return newDataPoint;
}

export async function getHealthDataHistory(): Promise<HealthDataPoint[]> {
  console.log('Fetching health data history (anonymous)');
  // In a real app, this would fetch from Firestore.
  // For anonymous users, we return an empty array or mock data.
  // For demonstration, let's return a few mock data points.
  const today = new Date();
  return [
    {
      id: 'mock-1',
      weight: 72,
      systolic: 122,
      diastolic: 81,
      mood: 4,
      createdAt: new Date(today.setDate(today.getDate() - 4)),
    },
    {
      id: 'mock-2',
      weight: 71.5,
      systolic: 120,
      diastolic: 79,
      mood: 5,
      createdAt: new Date(today.setDate(today.getDate() - 2)),
    },
     {
      id: 'mock-3',
      weight: 71,
      systolic: 118,
      diastolic: 78,
      mood: 4,
      createdAt: new Date(),
    },
  ];
}
