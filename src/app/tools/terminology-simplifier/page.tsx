
import {AppLayout} from '@/components/app-layout';
import {TerminologySimplifier} from '@/components/terminology-simplifier';

export default function TerminologySimplifierPage() {
  return (
    <AppLayout>
      <div className="p-4 md:p-6 border-b border-blue-500/20">
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Medical Terminology Simplifier
        </h2>
        <p className="text-muted-foreground">
          Break down complex medical jargon into simple, understandable language.
        </p>
      </div>
      <TerminologySimplifier />
    </AppLayout>
  );
}
