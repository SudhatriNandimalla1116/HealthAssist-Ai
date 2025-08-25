'use server';

/**
 * @fileOverview Maps user-provided symptoms to potential medical conditions using AI.
 *
 * - symptomToCondition - An async function that takes user symptoms and returns potential conditions.
 * - SymptomToConditionInput - The input type for the symptomToCondition function.
 * - SymptomToConditionOutput - The return type for the symptomToCondition function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomToConditionInputSchema = z.object({
  symptoms: z
    .string() // Changed from array to string
    .describe('The symptoms described by the user.'),
});
export type SymptomToConditionInput = z.infer<typeof SymptomToConditionInputSchema>;

const SymptomToConditionOutputSchema = z.object({
  potentialConditions:
    z.string()
      .describe('A list of potential medical conditions related to the symptoms.'),
  disclaimer: z.string().describe('Medical disclaimer to be displayed to the user.'),
});
export type SymptomToConditionOutput = z.infer<typeof SymptomToConditionOutputSchema>;

export async function symptomToCondition(input: SymptomToConditionInput): Promise<SymptomToConditionOutput> {
  return symptomToConditionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomToConditionPrompt',
  input: {schema: SymptomToConditionInputSchema},
  output: {schema: SymptomToConditionOutputSchema},
  prompt: `You are an AI medical assistant. A user will provide a list of symptoms, and you will return a list of potential medical conditions related to those symptoms.\n\n  Always lead with the following disclaimer: \"This information is intended for informational purposes only and does not constitute medical advice. Always consult with a qualified healthcare professional for diagnosis and treatment.\"\n\n  Symptoms: {{{symptoms}}}\n\n  Potential Conditions:`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_MEDICAL',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
});

const symptomToConditionFlow = ai.defineFlow(
  {
    name: 'symptomToConditionFlow',
    inputSchema: SymptomToConditionInputSchema,
    outputSchema: SymptomToConditionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      ...output!,
      disclaimer:
        'This information is intended for informational purposes only and does not constitute medical advice. Always consult with a qualified healthcare professional for diagnosis and treatment.',
    };
  }
);
