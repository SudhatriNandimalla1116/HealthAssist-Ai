'use server';

import {emergencyTriage} from '@/ai/flows/emergency-triage';
import {simplifyMedicalTerminology} from '@/ai/flows/medical-terminology-simplifier';
import {mapSymptoms, type MapSymptomsOutput} from '@/ai/flows/map-symptoms';
import {textToSpeech} from '@/ai/flows/text-to-speech';
import type {ChatMessage, HealthDataPoint} from '@/types';
import {ai} from '@/ai/genkit';
import {z} from 'zod';


// Schema for analyzeSkinCondition flow
const AnalyzeSkinConditionInputSchema = z.object({
  photoDataUri: z.string().describe("A photo of a skin condition, as a data URI."),
});
const AnalyzeSkinConditionOutputSchema = z.object({
  analysis: z.string().describe("The AI's analysis of the skin condition."),
});

// Genkit flow for analyzing skin conditions
const analyzeSkinConditionFlow = ai.defineFlow(
  {
    name: 'analyzeSkinConditionFlow',
    inputSchema: AnalyzeSkinConditionInputSchema,
    outputSchema: AnalyzeSkinConditionOutputSchema,
  },
  async (input) => {
    const prompt = `You are a dermatology assistant. Analyze the following image of a skin condition and provide a brief, helpful analysis. Start with a clear disclaimer that this is not a medical diagnosis and the user should consult a dermatologist. Describe what you see, mention potential (but not definitive) conditions it might resemble, and suggest next steps, like monitoring or seeing a doctor. Keep the tone helpful and cautious. Image: {{media url=photoDataUri}}`;
    
    const { output } = await ai.generate({
      prompt,
      model: 'googleai/gemini-2.0-flash',
      input: { photoDataUri: input.photoDataUri },
      output: { schema: AnalyzeSkinConditionOutputSchema },
       config: {
        safetySettings: [
          { category: 'HARM_CATEGORY_MEDICAL', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ],
      },
    });

    return output!;
  }
);


export async function analyzeSkinCondition(input: { photoDataUri: string }): Promise<{ analysis: string }> {
  return analyzeSkinConditionFlow(input);
}


export async function submitMessage(
  userId: string,
  content: string
): Promise<ChatMessage> {
  const triageResult = await emergencyTriage({userInput: content});

  let textContent: string;
  let isEmergency = false;
  let disclaimer: string | undefined;

  if (triageResult.isEmergency) {
    textContent = triageResult.response;
    isEmergency = true;
    disclaimer = triageResult.response;
  } else {
    const conditionResult = await mapSymptoms({symptoms: content});
    textContent = conditionResult.potentialConditions;
    disclaimer = conditionResult.disclaimer;
  }
  
  const { audioUrl } = await textToSpeech(textContent);

  return {
    id: `ai-${Date.now()}`,
    role: 'assistant',
    content: textContent,
    audioUrl,
    isEmergency,
    disclaimer,
    createdAt: new Date(),
  };
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
