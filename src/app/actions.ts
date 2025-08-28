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
        // Use only valid Gemini safety categories
        safetySettings: [
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' },
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
  try {
    const triageResult = await emergencyTriage({userInput: content});

    let textContent: string;
    let isEmergency = false;
    let disclaimer: string | undefined;

    if (triageResult.isEmergency) {
      textContent = triageResult.response;
      isEmergency = true;
      disclaimer = triageResult.response;
    } else {
      try {
        const conditionResult = await mapSymptoms({symptoms: content});
        textContent = conditionResult.potentialConditions;
        disclaimer = conditionResult.disclaimer;
      } catch (symptomError) {
        console.error('Error in symptom analysis:', symptomError);
        // Provide a helpful fallback response instead of an error
        textContent = `I understand you're experiencing symptoms. While I can't provide a medical diagnosis, I can help explain medical terms and provide general information. For specific medical concerns, please consult with a healthcare professional.`;
        disclaimer = 'This AI is for informational purposes only and does not provide medical advice. Consult a healthcare professional for any medical concerns.';
      }
    }
    
    let audioUrl = '';
    try {
      const audioResult = await textToSpeech(textContent);
      audioUrl = audioResult.audioUrl;
    } catch (audioError) {
      console.error('Error generating audio:', audioError);
      // Continue without audio if there's an error
    }

    return {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: textContent,
      audioUrl,
      isEmergency,
      disclaimer,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('Error in submitMessage:', error);
    
    // Provide a helpful fallback response
    const fallbackResponse = `I'm here to help with health-related questions and information. While I can't provide medical advice, I can help explain medical terms and provide general health information. For specific medical concerns, please consult with a healthcare professional.`;
    
    return {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: fallbackResponse,
      audioUrl: '',
      isEmergency: false,
      disclaimer: 'This AI is for informational purposes only and does not provide medical advice. Consult a healthcare professional for any medical concerns.',
      createdAt: new Date(),
    };
  }
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
    
    // Provide a more helpful fallback response based on the symptoms
    const fallbackResponse = `I understand you're experiencing symptoms. While I can't provide a medical diagnosis, I can help explain medical terms and provide general information. 

For the symptoms you mentioned, it's important to:
• Monitor your symptoms and note any changes
• Consider consulting with a healthcare professional for proper evaluation
• Use this tool to understand medical terminology better

Remember: This AI is for informational purposes only and does not provide medical advice.`;
    
    return {
      potentialConditions: fallbackResponse,
      disclaimer: 'This AI is for informational purposes only and does not provide medical advice. Consult a healthcare professional for any medical concerns.',
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
