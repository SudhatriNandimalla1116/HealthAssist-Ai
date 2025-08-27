'use client';

import {AppLayout} from '@/components/app-layout';
import {HealthReminders} from '@/components/health-reminders';

export default function HealthRemindersPage() {
  return (
    <AppLayout>
      <div className="p-4 md:p-6">
        <h2 className="text-2xl font-bold tracking-tight">Health Reminders</h2>
        <p className="text-muted-foreground">
          Set reminders for medications and appointments.
        </p>
      </div>
      <HealthReminders />
    </AppLayout>
  );
}
