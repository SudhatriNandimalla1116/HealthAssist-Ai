'use server';

/**
 * @fileOverview Maps user-provided symptoms to potential medical conditions using AI, ranking them by likelihood.
 *
 * - mapSymptoms - An async function that takes user symptoms and returns potential conditions ranked by likelihood.
 * - MapSymptomsInput - The input type for the mapSymptoms function.
 * - MapSymptomsOutput - The return type for the mapSymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MapSymptomsInputSchema = z.object({
  symptoms: z
    .string()
    .describe('The symptoms described by the user.'),
});
export type MapSymptomsInput = z.infer<typeof MapSymptomsInputSchema>;

const MapSymptomsOutputSchema = z.object({
  potentialConditions: z
    .string()
    .describe('A list of potential medical conditions related to the symptoms, ranked by likelihood.'),
  disclaimer: z.string().describe('Medical disclaimer to be displayed to the user.'),
});
export type MapSymptomsOutput = z.infer<typeof MapSymptomsOutputSchema>;

export async function mapSymptoms(input: MapSymptomsInput): Promise<MapSymptomsOutput> {
  return mapSymptomsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mapSymptomsPrompt',
  input: {schema: MapSymptomsInputSchema},
  output: {schema: MapSymptomsOutputSchema},
  prompt: `You are an AI medical assistant. A user will provide a list of symptoms, and you will return a list of potential medical conditions related to those symptoms, ranked by likelihood, with the most likely condition first.\n\n  Always lead with the following disclaimer: \"This information is intended for informational purposes only and does not constitute medical advice. Always consult with a qualified healthcare professional for diagnosis and treatment.\"\n  Symptoms: {{{symptoms}}}\n  Potential Conditions:`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_MEDICAL',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
});

const mapSymptomsFlow = ai.defineFlow(
  {
    name: 'mapSymptomsFlow',
    inputSchema: MapSymptomsInputSchema,
    outputSchema: MapSymptomsOutputSchema,
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
