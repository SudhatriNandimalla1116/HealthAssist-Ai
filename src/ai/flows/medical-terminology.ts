'use server';

/**
 * @fileOverview AI-powered medical terminology simplifier.
 *
 * - simplifyMedicalTerminology - A function that simplifies complex medical terms.
 * - SimplifyMedicalTerminologyInput - The input type for the simplifyMedicalTerminology function.
 * - SimplifyMedicalTerminologyOutput - The return type for the simplifyMedicalTerminology function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimplifyMedicalTerminologyInputSchema = z.object({
  medicalText: z
    .string()
    .describe('The medical text to simplify, which may contain complex terminology.'),
});
export type SimplifyMedicalTerminologyInput = z.infer<typeof SimplifyMedicalTerminologyInputSchema>;

const SimplifyMedicalTerminologyOutputSchema = z.object({
  simplifiedText: z
    .string()
    .describe('The simplified version of the input medical text.'),
});
export type SimplifyMedicalTerminologyOutput = z.infer<typeof SimplifyMedicalTerminologyOutputSchema>;

export async function simplifyMedicalTerminology(
  input: SimplifyMedicalTerminologyInput
): Promise<SimplifyMedicalTerminologyOutput> {
  return simplifyMedicalTerminologyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simplifyMedicalTerminologyPrompt',
  input: {schema: SimplifyMedicalTerminologyInputSchema},
  output: {schema: SimplifyMedicalTerminologyOutputSchema},
  prompt: `You are a medical expert who simplifies complex medical terms into easy-to-understand language for the layperson.\n\nSimplify the following medical text:\n\n{{{medicalText}}}`,
});

const simplifyMedicalTerminologyFlow = ai.defineFlow(
  {
    name: 'simplifyMedicalTerminologyFlow',
    inputSchema: SimplifyMedicalTerminologyInputSchema,
    outputSchema: SimplifyMedicalTerminologyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
