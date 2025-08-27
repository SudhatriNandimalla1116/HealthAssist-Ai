
import {AppLayout} from '@/components/app-layout';
import {SkinAnalyzer} from '@/components/skin-analyzer';

export default function SkinAnalyzerPage() {
  return (
    <AppLayout>
      <div className="p-4 md:p-6">
        <h2 className="text-2xl font-bold tracking-tight">Skin Condition Analyzer</h2>
        <p className="text-muted-foreground">
          Upload or take a photo of a skin condition for AI-powered analysis.
        </p>
      </div>
      <SkinAnalyzer />
    </AppLayout>
  );
}
