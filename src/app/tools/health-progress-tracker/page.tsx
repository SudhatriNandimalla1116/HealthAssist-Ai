
import {AppLayout} from '@/components/app-layout';
import {HealthProgressTracker} from '@/components/health-progress-tracker';

export default function HealthProgressTrackerPage() {
  return (
    <AppLayout>
      <div className="p-4 md:p-6">
        <h2 className="text-2xl font-bold tracking-tight">Health Progress Tracker</h2>
        <p className="text-muted-foreground">
          Monitor your health metrics over time to stay on top of your wellness goals.
        </p>
      </div>
      <HealthProgressTracker />
    </AppLayout>
  );
}
