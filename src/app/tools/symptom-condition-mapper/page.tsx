
import {AppLayout} from '@/components/app-layout';
import {SymptomConditionMapper} from '@/components/symptom-condition-mapper';


export default function SymptomConditionMapperPage() {
  return (
    <AppLayout>
      <div className="p-4 md:p-6">
        <h2 className="text-2xl font-bold tracking-tight">Symptom to Condition Mapper</h2>
        <p className="text-muted-foreground">
          Enter your symptoms to see a list of potential related medical conditions.
        </p>
      </div>
      <SymptomConditionMapper />
    </AppLayout>
  );
}
