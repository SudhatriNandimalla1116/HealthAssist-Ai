
import {AppLayout} from '@/components/app-layout';
import {TerminologySimplifier} from '@/components/terminology-simplifier';

export default function TerminologySimplifierPage() {
  return (
    <AppLayout>
      <div className="p-4 md:p-6">
        <h2 className="text-2xl font-bold tracking-tight">
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
