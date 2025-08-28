'use server';

/**
 * @fileOverview Emergency triage flow to detect and respond to critical symptoms.
 * 
 * - emergencyTriage - A function that processes user input and checks for emergency symptoms.
 * - EmergencyTriageInput - The input type for the emergencyTriage function.
 * - EmergencyTriageOutput - The return type for the emergencyTriage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmergencyTriageInputSchema = z.object({
  userInput: z.string().describe('The user input string to check for emergency symptoms.'),
});
export type EmergencyTriageInput = z.infer<typeof EmergencyTriageInputSchema>;

const EmergencyTriageOutputSchema = z.object({
  isEmergency: z.boolean().describe('Whether the user input indicates an emergency.'),
  response: z.string().describe('The appropriate response based on the emergency check.'),
});
export type EmergencyTriageOutput = z.infer<typeof EmergencyTriageOutputSchema>;

export async function emergencyTriage(input: EmergencyTriageInput): Promise<EmergencyTriageOutput> {
  try {
    return await emergencyTriageFlow(input);
  } catch (error) {
    console.error('AI flow error, using fallback emergency triage:', error);
    
    // Fallback emergency triage when AI is not available
    const userInput = input.userInput.toLowerCase();
    
    // Simple keyword-based emergency detection
    if (userInput.includes('chest pain') || userInput.includes('heart attack')) {
      return {
        isEmergency: true,
        response: 'Seek immediate medical attention. Chest pain can be a sign of a heart attack.'
      };
    }
    
    if (userInput.includes('difficulty breathing') || userInput.includes('breathing problem')) {
      return {
        isEmergency: true,
        response: 'Seek immediate medical attention. Difficulty breathing can be a sign of a serious respiratory issue.'
      };
    }
    
    if (userInput.includes('loss of consciousness') || userInput.includes('fainted')) {
      return {
        isEmergency: true,
        response: 'Seek immediate medical attention. Loss of consciousness can indicate a serious medical condition.'
      };
    }
    
    if (userInput.includes('severe bleeding') || userInput.includes('heavy bleeding')) {
      return {
        isEmergency: true,
        response: 'Seek immediate medical attention. Severe bleeding requires immediate medical intervention.'
      };
    }
    
    if (userInput.includes('stroke') || userInput.includes('face drooping') || userInput.includes('arm weakness')) {
      return {
        isEmergency: true,
        response: 'Seek immediate medical attention. Act F.A.S.T. - Face drooping, Arm weakness, Speech difficulty, Time to call 911.'
      };
    }
    
    // No emergency detected
    return {
      isEmergency: false,
      response: ''
    };
  }
}

const prompt = ai.definePrompt({
  name: 'emergencyTriagePrompt',
  input: {schema: EmergencyTriageInputSchema},
  output: {schema: EmergencyTriageOutputSchema},
  prompt: `You are a triage assistant. You will analyze the user's input to determine if they are experiencing a medical emergency.  If the user mentions any of the following symptoms, respond as indicated below. Otherwise, isEmergency should be false and response should be an empty string.

  *   chest pain: isEmergency=true; response="Seek immediate medical attention. Chest pain can be a sign of a heart attack."
  *   difficulty breathing: isEmergency=true; response="Seek immediate medical attention. Difficulty breathing can be a sign of a serious respiratory issue."
  *   loss of consciousness: isEmergency=true; response="Seek immediate medical attention. Loss of consciousness can indicate a serious medical condition."
  *   severe bleeding: isEmergency=true; response="Seek immediate medical attention. Severe bleeding requires immediate medical intervention."
  *   stroke symptoms: isEmergency=true; response="Seek immediate medical attention. Act F.A.S.T. - Face drooping, Arm weakness, Speech difficulty, Time to call 911."

User Input: {{{userInput}}}`,
});

const emergencyTriageFlow = ai.defineFlow(
  {
    name: 'emergencyTriageFlow',
    inputSchema: EmergencyTriageInputSchema,
    outputSchema: EmergencyTriageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
