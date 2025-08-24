import { config } from 'dotenv';
config();

import '@/ai/flows/emergency-triage.ts';
import '@/ai/flows/symptom-to-condition.ts';
import '@/ai/flows/medical-terminology.ts';