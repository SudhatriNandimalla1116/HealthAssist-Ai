import { config } from 'dotenv';
config();

import '@/ai/flows/emergency-triage.ts';
import '@/ai/flows/map-symptoms.ts';
import '@/ai/flows/medical-terminology-simplifier.ts';
import '@/ai/flows/symptom-to-condition.ts';
import '@/ai/flows/text-to-speech.ts';
