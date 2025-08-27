'use client';

import {AppLayout} from '@/components/app-layout';
import {HealthServicesFinder} from '@/components/health-services-finder';

export default function HealthServicesFinderPage() {
  return (
    <AppLayout>
      <div className="p-4 md:p-6">
        <h2 className="text-2xl font-bold tracking-tight">Nearby Health Services</h2>
        <p className="text-muted-foreground">
          Find doctors, hospitals, and pharmacies in your area.
        </p>
      </div>
      <HealthServicesFinder />
    </AppLayout>
  );
}
